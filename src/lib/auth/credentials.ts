import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";

const DATA_DIR = path.join(process.cwd(), "data");
const AUTH_FILE = path.join(DATA_DIR, "auth.json");

type AuthFile = { passwordHash: string; updatedAt: string };

/**
 * The current password hash.
 *
 * ADMIN_PASSWORD_HASH is the bootstrap value; once the password is changed
 * through the dashboard the new hash lives in data/auth.json, which is
 * gitignored because it is a credential and this repository is public.
 */
export async function getPasswordHash(): Promise<string | undefined> {
  try {
    const raw = await fs.readFile(AUTH_FILE, "utf8");
    const parsed = JSON.parse(raw) as AuthFile;
    if (parsed?.passwordHash) return parsed.passwordHash;
  } catch {
    // No override saved yet — fall through to the environment value.
  }
  return process.env.ADMIN_PASSWORD_HASH;
}

export async function setPasswordHash(passwordHash: string): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  const payload: AuthFile = { passwordHash, updatedAt: new Date().toISOString() };
  await fs.writeFile(AUTH_FILE, JSON.stringify(payload, null, 2) + "\n", "utf8");
}
