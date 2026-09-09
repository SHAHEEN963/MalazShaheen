/**
 * Built-in fallback password hash.
 *
 * This is a **scrypt hash**, not a password — it is one-way and cannot be
 * turned back into the original. It lives in the code so a fresh deployment
 * works without configuring anything, which is why it is safe to have in a
 * public repository *only as long as the password behind it stays strong*:
 * the current one is 20 random characters (~116 bits), far beyond offline
 * brute force against scrypt.
 *
 * Precedence, strongest first (see getPasswordHash):
 *   1. data/auth.json        — set by the dashboard reset or `npm run set-password`
 *   2. ADMIN_PASSWORD_HASH   — environment variable, best for hosting
 *   3. this value            — last-resort default
 *
 * To stop relying on this entirely, run `npm run set-password` and put the
 * printed hash in ADMIN_PASSWORD_HASH; that overrides this file.
 */
export const DEFAULT_PASSWORD_HASH =
  "scrypt$208e4b46c02d89e520c3c0f2c3210493$fda1cd7665b0b1376b6b7bca52747f4a87861c71578b696347266d34a824af48f5d61e133300f29a7b6c3146fc0852fd2a76551de554ae3bf1b10d217a4c7323";
