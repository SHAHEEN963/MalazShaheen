#!/usr/bin/env node
/**
 * Sets the dashboard password.
 *
 *   npm run set-password
 *
 * Writes the scrypt hash to data/auth.json (gitignored) and prints it so the
 * same value can be pasted into ADMIN_PASSWORD_HASH for a hosted deployment.
 * The plaintext password is never written anywhere.
 */
import { randomBytes, scrypt as scryptCb } from "node:crypto";
import { promisify } from "node:util";
import { promises as fs } from "node:fs";
import path from "node:path";
import readline from "node:readline";

const scrypt = promisify(scryptCb);
const KEY_LEN = 64;

async function hashPassword(password) {
  const salt = randomBytes(16);
  const key = await scrypt(password, salt, KEY_LEN);
  return `scrypt$${salt.toString("hex")}$${key.toString("hex")}`;
}

function ask(question) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) =>
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer);
    })
  );
}

const fromArgv = process.argv[2];
const password = fromArgv ?? (await ask("كلمة المرور الجديدة (١٢ حرفًا فأكثر): "));

if (!password || password.length < 12) {
  console.error("\n✗ كلمة المرور قصيرة جدًا — اجعلها ١٢ حرفًا على الأقل.");
  process.exit(1);
}

const hash = await hashPassword(password);
const dataDir = path.join(process.cwd(), "data");
await fs.mkdir(dataDir, { recursive: true });
await fs.writeFile(
  path.join(dataDir, "auth.json"),
  JSON.stringify({ passwordHash: hash, updatedAt: new Date().toISOString() }, null, 2) + "\n",
  "utf8"
);

console.log("\n✓ حُفظت كلمة المرور في data/auth.json (غير مرفوع إلى git).");
console.log("\nللنشر على استضافة، اضبط متغير البيئة:");
console.log(`ADMIN_PASSWORD_HASH=${hash}\n`);
