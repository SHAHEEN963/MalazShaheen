import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { getPasswordHash } from "./credentials";

const RESET_TTL_SECONDS = 60 * 30; // 30 minutes

/**
 * Reset tokens are signed with SESSION_SECRET **plus the current password
 * hash**. Changing the password therefore changes the signing key, which makes
 * every outstanding reset link stop verifying — single use, with no extra
 * storage to keep in sync.
 */
async function getResetKey(): Promise<string> {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("SESSION_SECRET مفقود أو قصير جدًا. أضفه إلى .env.local");
  }
  const currentHash = (await getPasswordHash()) ?? "no-password-set";
  return `${secret}:${currentHash}`;
}

function b64url(value: string): string {
  return Buffer.from(value, "utf8").toString("base64url");
}

export async function createResetToken(email: string): Promise<string> {
  const payload = JSON.stringify({
    email: email.toLowerCase(),
    exp: Math.floor(Date.now() / 1000) + RESET_TTL_SECONDS,
  });
  const encoded = b64url(payload);
  const signature = createHmac("sha256", await getResetKey())
    .update(encoded)
    .digest("base64url");
  return `${encoded}.${signature}`;
}

export async function verifyResetToken(
  token: string | undefined
): Promise<string | null> {
  if (!token) return null;
  const [encoded, signature] = token.split(".");
  if (!encoded || !signature) return null;

  try {
    const expected = createHmac("sha256", await getResetKey())
      .update(encoded)
      .digest("base64url");

    const a = Buffer.from(signature);
    const b = Buffer.from(expected);
    if (a.length !== b.length || !timingSafeEqual(a, b)) return null;

    const payload = JSON.parse(
      Buffer.from(encoded, "base64url").toString("utf8")
    ) as { email: string; exp: number };

    if (typeof payload.exp !== "number" || payload.exp * 1000 < Date.now()) {
      return null;
    }
    return payload.email;
  } catch {
    return null;
  }
}

/**
 * Sends the reset link. With RESEND_API_KEY set it goes out by email; without
 * it the link is printed to the server console so the flow is fully usable in
 * local development without signing up for an email provider.
 */
export async function sendResetEmail(email: string, url: string): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESET_EMAIL_FROM ?? "onboarding@resend.dev";

  if (!apiKey) {
    console.info(
      `\n[لوحة التحكم] رابط إعادة تعيين كلمة المرور لـ ${email}:\n${url}\n(لم يُضبط RESEND_API_KEY، لذلك طُبع الرابط هنا بدل إرساله بالبريد.)\n`
    );
    return;
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [email],
      subject: "إعادة تعيين كلمة مرور لوحة التحكم",
      html: `<div dir="rtl" style="font-family:system-ui,sans-serif;line-height:1.9">
        <h2>إعادة تعيين كلمة المرور</h2>
        <p>اضغط الرابط التالي لتعيين كلمة مرور جديدة. ينتهي خلال ٣٠ دقيقة ويصلح لمرة واحدة فقط:</p>
        <p><a href="${url}">${url}</a></p>
        <p style="color:#666">إن لم تطلب هذا، تجاهل الرسالة — لم يتغيّر شيء.</p>
      </div>`,
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`تعذّر إرسال البريد: ${response.status} ${detail.slice(0, 200)}`);
  }
}
