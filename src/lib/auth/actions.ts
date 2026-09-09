"use server";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { getAdminEmails, isAdminEmail } from "./admin";
import { getPasswordHash, setPasswordHash } from "./credentials";
import { hashPassword, verifyPassword } from "./password";
import { createResetToken, sendResetEmail, verifyResetToken } from "./reset";
import { SESSION_COOKIE, SESSION_MAX_AGE, createSessionToken } from "./session";

export type FormState = { error?: string; notice?: string };

/** Slows down bulk password guessing a little without a rate-limit store. */
function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function baseUrl(): Promise<string> {
  const h = await headers();
  const host = h.get("host") ?? "localhost:3000";
  const protocol = host.startsWith("localhost") ? "http" : "https";
  return `${protocol}://${host}`;
}

export async function login(
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "أدخل البريد وكلمة المرور." };
  }

  const storedHash = await getPasswordHash();
  if (!storedHash) {
    return {
      error:
        "لم تُضبط كلمة مرور بعد. شغّل: npm run set-password  ثم أعد المحاولة.",
    };
  }

  // Always run the hash comparison, even for a non-admin address, so the
  // response time does not reveal which emails exist.
  const emailAllowed = isAdminEmail(email);
  const passwordOk = await verifyPassword(password, storedHash);

  if (!emailAllowed || !passwordOk) {
    await delay(600);
    return { error: "البريد أو كلمة المرور غير صحيحة." };
  }

  const token = await createSessionToken(email.toLowerCase());
  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });

  redirect("/dashboard");
}

export async function logout(): Promise<void> {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
  redirect("/dashboard/login");
}

export async function requestReset(
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  const email = String(formData.get("email") ?? "").trim();

  // Same reply either way: never confirm whether an address is an admin.
  const neutral: FormState = {
    notice:
      "إن كان هذا البريد مُصرّحًا له، فقد أُرسل إليه رابط إعادة التعيين. تحقّق من بريدك.",
  };

  if (!isAdminEmail(email)) {
    await delay(500);
    return neutral;
  }

  try {
    const token = await createResetToken(email);
    const url = `${await baseUrl()}/dashboard/reset?token=${encodeURIComponent(token)}`;
    await sendResetEmail(email.toLowerCase(), url);
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "تعذّر إرسال رابط إعادة التعيين.",
    };
  }

  return neutral;
}

export async function resetPassword(
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  const token = String(formData.get("token") ?? "");
  const password = String(formData.get("password") ?? "");
  const confirm = String(formData.get("confirm") ?? "");

  const email = await verifyResetToken(token);
  if (!email) {
    return { error: "الرابط منتهي أو مستخدم من قبل. اطلب رابطًا جديدًا." };
  }
  if (password.length < 12) {
    return { error: "اجعل كلمة المرور ١٢ حرفًا على الأقل." };
  }
  if (password !== confirm) {
    return { error: "كلمتا المرور غير متطابقتين." };
  }

  try {
    await setPasswordHash(await hashPassword(password));
  } catch {
    return {
      error:
        "تعذّر حفظ كلمة المرور الجديدة — التخزين للقراءة فقط في بيئة النشر الحالية.",
    };
  }

  return {
    notice: "تم تغيير كلمة المرور. يمكنك تسجيل الدخول الآن.",
  };
}

/** Exposed so the login screen can hint which addresses are allowed. */
export async function adminEmailHint(): Promise<string[]> {
  return getAdminEmails();
}
