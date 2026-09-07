/**
 * Minimal signed-cookie session for /admin.
 *
 * Uses Web Crypto (HMAC-SHA256) so the same code runs in both the Node
 * runtime (API routes) and the Edge runtime (middleware).
 */
import { cookies } from "next/headers";

export const SESSION_COOKIE = "tn_admin";
const MAX_AGE = 60 * 60 * 12; // 12 hours

function secret() {
  return process.env.AUTH_SECRET || "insecure-dev-secret-change-me";
}

function b64url(bytes: Uint8Array) {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

/**
 * The token payload is `<username>.<expiry>.<signature>`, so the username
 * must not contain a dot — an admin email would otherwise split the payload
 * apart and corrupt the expiry. Base64url has no dots, so encode it.
 */
function encodeSegment(value: string) {
  return b64url(new TextEncoder().encode(value));
}

function decodeSegment(value: string) {
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
  const binary = atob(padded);
  return new TextDecoder().decode(Uint8Array.from(binary, (c) => c.charCodeAt(0)));
}

async function sign(payload: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payload));
  return b64url(new Uint8Array(signature));
}

/** Constant-time string compare, to avoid leaking the signature by timing. */
function safeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i += 1) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export async function createToken(username: string) {
  const payload = `${encodeSegment(username)}.${Date.now() + MAX_AGE * 1000}`;
  return `${payload}.${await sign(payload)}`;
}

export async function verifyToken(token?: string | null): Promise<string | null> {
  if (!token) return null;
  const index = token.lastIndexOf(".");
  if (index < 0) return null;
  const payload = token.slice(0, index);
  const signature = token.slice(index + 1);
  const expected = await sign(payload);
  if (!safeEqual(signature, expected)) return null;
  const separator = payload.indexOf(".");
  if (separator < 1) return null;
  const username = payload.slice(0, separator);
  const expiry = Number(payload.slice(separator + 1));
  if (!Number.isFinite(expiry) || expiry < Date.now()) return null;
  try {
    return decodeSegment(username);
  } catch {
    return null;
  }
}

export function checkCredentials(username: string, password: string) {
  const expectedUser = process.env.ADMIN_USERNAME || "admin";
  const expectedPass = process.env.ADMIN_PASSWORD || "trekadmin123";
  return safeEqual(username, expectedUser) && safeEqual(password, expectedPass);
}

export const cookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: MAX_AGE,
};

/** Server-side session read for admin pages and API routes. */
export async function getSession() {
  const store = await cookies();
  return verifyToken(store.get(SESSION_COOKIE)?.value);
}

export async function requireSession() {
  const user = await getSession();
  if (!user) throw new Error("UNAUTHORIZED");
  return user;
}
