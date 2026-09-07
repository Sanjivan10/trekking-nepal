import { NextResponse } from "next/server";
import { checkCredentials, createToken, SESSION_COOKIE, cookieOptions } from "@/lib/auth";

/** Small in-memory rate limit — blunts credential stuffing in single-node deploys. */
const attempts = new Map<string, { count: number; resetAt: number }>();
const WINDOW = 10 * 60 * 1000;
const MAX_ATTEMPTS = 8;

export async function POST(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    request.headers.get("x-real-ip") ||
    "local";

  const now = Date.now();
  const record = attempts.get(ip);
  if (record && record.resetAt > now && record.count >= MAX_ATTEMPTS) {
    return NextResponse.json(
      { error: "Too many attempts. Try again in a few minutes." },
      { status: 429 },
    );
  }

  const body = await request.json().catch(() => ({}));
  const username = String(body.username ?? "");
  const password = String(body.password ?? "");

  if (!checkCredentials(username, password)) {
    const next = record && record.resetAt > now ? record : { count: 0, resetAt: now + WINDOW };
    next.count += 1;
    attempts.set(ip, next);
    return NextResponse.json({ error: "Incorrect email or password." }, { status: 401 });
  }

  attempts.delete(ip);
  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE, await createToken(username), cookieOptions);
  return response;
}
