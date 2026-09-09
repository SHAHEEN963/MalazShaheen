"use client";

import Link from "next/link";
import { useActionState } from "react";
import { requestReset, type FormState } from "@/lib/auth/actions";

const initialState: FormState = {};

export function ForgotForm() {
  const [state, formAction, pending] = useActionState(requestReset, initialState);

  return (
    <form action={formAction} className="dash-card flex flex-col gap-5">
      <p className="text-sm leading-relaxed text-ink-sand">
        أدخل بريدك المُصرّح له، وسنرسل رابطًا صالحًا لثلاثين دقيقة ولمرة واحدة فقط.
      </p>

      <div>
        <label className="dash-label" htmlFor="email">
          البريد الإلكتروني
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          dir="ltr"
          className="dash-input text-start"
          placeholder="you@example.com"
        />
      </div>

      {state.error && (
        <p role="alert" className="text-sm text-[var(--color-danger)]">
          {state.error}
        </p>
      )}
      {state.notice && (
        <p role="status" className="text-sm text-[var(--color-success)]">
          {state.notice}
        </p>
      )}

      <button type="submit" className="dash-btn dash-btn-primary" disabled={pending}>
        {pending ? "جارٍ الإرسال…" : "أرسل رابط إعادة التعيين"}
      </button>

      <Link
        href="/dashboard/login"
        className="text-center text-sm text-ink-sand underline-offset-4 hover:text-ink-gold hover:underline"
      >
        العودة لتسجيل الدخول
      </Link>
    </form>
  );
}
