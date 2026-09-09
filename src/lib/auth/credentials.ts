import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";
import { DEFAULT_PASSWORD_HASH } from "./default-password";

const DATA_DIR = path.join(process.cwd(), "data");
const AUTH_FILE = path.join(DATA_DIR, "auth.json");

type AuthFile = { passwordHash: string; updatedAt: string };

/**
 * The current password hash, strongest source first:
 *   1. data/auth.json      — a reset done through the dashboard, or set-password
 *   2. ADMIN_PASSWORD_HASH — environment variable, the right place when hosted
 *   3. DEFAULT_PASSWORD_HASH — built-in fallback so a fresh clone just works
 *
 * Only ever a hash. The plaintext password is never stored anywhere.
 */
export async function getPasswordHash(): Promise<string | undefined> {
  try {
    const raw = await fs.readFile(AUTH_FILE, "utf8");
    const parsed = JSON.parse(raw) as AuthFile;
    if (parsed?.passwordHash) return parsed.passwordHash;
  } catch {
    // No override saved yet — fall through.
  }
  return process.env.ADMIN_PASSWORD_HASH || DEFAULT_PASSWORD_HASH;
}

export async function setPasswordHash(passwordHash: string): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  const payload: AuthFile = { passwordHash, updatedAt: new Date().toISOString() };
  await fs.writeFile(AUTH_FILE, JSON.stringify(payload, null, 2) + "\n", "utf8");
}
