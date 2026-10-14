import { cookies } from "next/headers";

const COOKIE = "ryfe_admin";

function secret() {
  return process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD || "ryfe-dev-secret";
}

async function hmacHex(message: string) {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(message));
  return [...new Uint8Array(signature)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

function safeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i += 1) mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return mismatch === 0;
}

export async function signSession() {
  const issued = Date.now().toString();
  const signature = await hmacHex(issued);
  return `${issued}.${signature}`;
}

export async function verifySession(token: string | undefined) {
  if (!token || !token.includes(".")) return false;
  const [issued, signature] = token.split(".");
  const expected = await hmacHex(issued);
  return safeEqual(signature, expected);
}

export async function isAdmin() {
  const jar = await cookies();
  return verifySession(jar.get(COOKIE)?.value);
}

export function sessionCookieName() {
  return COOKIE;
}

export function checkPassword(password: string) {
  const expected = process.env.ADMIN_PASSWORD || "ryfe-admin";
  return safeEqual(password, expected);
}
