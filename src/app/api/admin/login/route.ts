import { NextResponse } from "next/server";
import { checkCredentials, createToken, SESSION_COOKIE, cookieOptions } from "@/lib/auth";
import {
  clientIp,
  checkThrottle,
  recordFailure,
  clearAttempts,
  audit,
  sameOrigin,
  LOCK_MINUTES,
} from "@/lib/security";

export async function POST(request: Request) {
  if (!sameOrigin(request)) {
    return NextResponse.json({ error: "Bad origin." }, { status: 403 });
  }

  const ip = clientIp(request);
  const throttle = await checkThrottle(ip);
  if (!throttle.allowed) {
    const minutes = Math.max(1, Math.ceil(throttle.retryAfterSeconds / 60));
    return NextResponse.json(
      { error: `Too many failed attempts. Try again in ${minutes} minute(s).` },
      { status: 429, headers: { "Retry-After": String(throttle.retryAfterSeconds || 60) } },
    );
  }

  const body = await request.json().catch(() => ({}));
  const username = String(body.username ?? "").slice(0, 200);
  const password = String(body.password ?? "").slice(0, 200);

  if (!checkCredentials(username, password)) {
    await recordFailure(ip);
    await audit({
      actor: username || "(blank)",
      action: "login_failed",
      entity: "auth",
      summary: `Failed sign-in. ${Math.max(0, throttle.remaining - 1)} attempt(s) left before a ${LOCK_MINUTES}-minute lock.`,
      request,
    });
    return NextResponse.json({ error: "Incorrect email or password." }, { status: 401 });
  }

  await clearAttempts(ip);
  await audit({ actor: username, action: "login", entity: "auth", summary: "Signed in", request });

  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE, await createToken(username), cookieOptions);
  return response;
}
