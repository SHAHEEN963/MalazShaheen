/**
 * Built-in fallback password hash.
 *
 * This is a **scrypt hash**, not a password — it is one-way and cannot be
 * turned back into the original. It lives in the code so a fresh deployment
 * works without configuring anything, which is why it is safe to have in a
 * public repository *only as long as the password behind it stays strong*:
 * the current one is 20 mixed characters, far beyond offline brute force
 * against scrypt.
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
  "scrypt$fb0cb988dd45935cfe60fe525f2062d1$721917dd88bc2a06cb5e4d1bb85a479f11ebd9a9939f57bd2a3e6a2993d924e3de49914bcc38ac4965097f5fe0dd24bd280364e76d8989c7ec10d58c37d49c26";
