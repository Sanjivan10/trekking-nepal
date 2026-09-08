/**
 * Security helpers for the admin surface.
 *
 * The previous rate limiter kept counters in a module-level Map. On Vercel
 * every request can hit a fresh serverless instance, so that counter resets
 * constantly and barely slows an attacker down. These are database-backed.
 */
import { prisma } from "./prisma";

export const MAX_ATTEMPTS = 8;
export const LOCK_MINUTES = 15;
export const ATTEMPT_WINDOW_MINUTES = 15;

/** Best-effort client IP from the proxy headers Vercel sets. */
export function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("x-real-ip") || "unknown";
}

export function userAgent(request: Request): string {
  return (request.headers.get("user-agent") || "").slice(0, 300);
}

export type ThrottleResult = { allowed: boolean; retryAfterSeconds: number; remaining: number };

export async function checkThrottle(identifier: string): Promise<ThrottleResult> {
  try {
    const row = await prisma.loginAttempt.findUnique({ where: { identifier } });
    if (!row) return { allowed: true, retryAfterSeconds: 0, remaining: MAX_ATTEMPTS };

    const now = Date.now();
    if (row.lockedUntil && row.lockedUntil.getTime() > now) {
      return {
        allowed: false,
        retryAfterSeconds: Math.ceil((row.lockedUntil.getTime() - now) / 1000),
        remaining: 0,
      };
    }
    // Attempts older than the window no longer count.
    if (now - row.lastAttempt.getTime() > ATTEMPT_WINDOW_MINUTES * 60_000) {
      return { allowed: true, retryAfterSeconds: 0, remaining: MAX_ATTEMPTS };
    }
    return {
      allowed: row.count < MAX_ATTEMPTS,
      retryAfterSeconds: 0,
      remaining: Math.max(0, MAX_ATTEMPTS - row.count),
    };
  } catch {
    // Never lock people out because the database hiccuped.
    return { allowed: true, retryAfterSeconds: 0, remaining: MAX_ATTEMPTS };
  }
}

export async function recordFailure(identifier: string) {
  try {
    const row = await prisma.loginAttempt.findUnique({ where: { identifier } });
    const now = new Date();
    const stale =
      row && now.getTime() - row.lastAttempt.getTime() > ATTEMPT_WINDOW_MINUTES * 60_000;
    const count = !row || stale ? 1 : row.count + 1;
    const lockedUntil =
      count >= MAX_ATTEMPTS ? new Date(now.getTime() + LOCK_MINUTES * 60_000) : null;

    await prisma.loginAttempt.upsert({
      where: { identifier },
      create: { identifier, count, lastAttempt: now, lockedUntil },
      update: { count, lastAttempt: now, lockedUntil },
    });
  } catch {
    /* logging must never break the login flow */
  }
}

export async function clearAttempts(identifier: string) {
  try {
    await prisma.loginAttempt.deleteMany({ where: { identifier } });
  } catch {
    /* ignore */
  }
}

/* ------------------------------ audit trail ----------------------------- */

export async function audit(entry: {
  actor: string;
  action: string;
  entity: string;
  entityId?: string;
  summary?: string;
  request?: Request;
}) {
  try {
    await prisma.auditLog.create({
      data: {
        actor: entry.actor.slice(0, 200),
        action: entry.action,
        entity: entry.entity,
        entityId: entry.entityId?.slice(0, 100) ?? "",
        summary: entry.summary?.slice(0, 500) ?? "",
        ip: entry.request ? clientIp(entry.request) : "",
        userAgent: entry.request ? userAgent(entry.request) : "",
      },
    });
  } catch {
    /* the audit log is best-effort; it must not block the action */
  }
}

/* --------------------------- CSRF (origin check) ------------------------- */

/**
 * Rejects state-changing admin requests whose Origin does not match the host.
 * SameSite=Lax already blocks most cross-site POSTs; this closes the gap for
 * clients that mishandle it, at zero cost.
 */
export function sameOrigin(request: Request): boolean {
  const method = request.method.toUpperCase();
  if (method === "GET" || method === "HEAD" || method === "OPTIONS") return true;

  const origin = request.headers.get("origin");
  // Non-browser callers (curl, server-to-server) send no Origin at all.
  if (!origin) return true;

  try {
    const host = request.headers.get("host");
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}
