import "server-only";
import { cookies } from "next/headers";
import { SESSION_COOKIE, verifySessionToken } from "./session";

/**
 * The accounts allowed to sign in. Configured through ADMIN_EMAILS so the
 * list can change without a code change; falls back to the two owner
 * addresses. Comparison is always lower-cased and trimmed.
 */
export function getAdminEmails(): string[] {
  const configured = process.env.ADMIN_EMAILS;
  const list = configured
    ? configured.split(",")
    : ["mlaz.shaheen@gmail.com", "mohammad.shaheen.963@gmail.com"];
  return list.map((e) => e.trim().toLowerCase()).filter(Boolean);
}

export function isAdminEmail(email: string): boolean {
  return getAdminEmails().includes(email.trim().toLowerCase());
}

/** The signed-in admin's email, or null. Verifies the cookie signature. */
export async function getSessionEmail(): Promise<string | null> {
  const store = await cookies();
  const payload = await verifySessionToken(store.get(SESSION_COOKIE)?.value);
  if (!payload) return null;
  // Re-check against the allow-list: revoking an address logs it out even if
  // it still holds a validly signed cookie.
  if (!isAdminEmail(payload.email)) return null;
  return payload.email;
}

/**
 * Guard for every mutating action. The proxy redirect is only an optimisation;
 * this is the check that actually protects data.
 */
export async function requireAdmin(): Promise<string> {
  const email = await getSessionEmail();
  if (!email) throw new Error("غير مصرّح — سجّل الدخول أولًا.");
  return email;
}
