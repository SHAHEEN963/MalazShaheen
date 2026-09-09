"use client";

import Link from "next/link";
import { useActionState } from "react";
import { login, type FormState } from "@/lib/auth/actions";

const initialState: FormState = {};

export function LoginForm() {
  const [state, formAction, pending] = useActionState(login, initialState);

  return (
    <form action={formAction} className="dash-card flex flex-col gap-5">
      <div>
        <label className="dash-label" htmlFor="email">
          البريد الإلكتروني
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="username"
          dir="ltr"
          className="dash-input text-start"
          placeholder="you@example.com"
        />
      </div>

      <div>
        <label className="dash-label" htmlFor="password">
          كلمة المرور
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          dir="ltr"
          className="dash-input text-start"
        />
      </div>

      {state.error && (
        <p role="alert" className="text-sm text-[var(--color-danger)]">
          {state.error}
        </p>
      )}

      <button type="submit" className="dash-btn dash-btn-primary" disabled={pending}>
        {pending ? "جارٍ التحقق…" : "تسجيل الدخول"}
      </button>

      <Link
        href="/dashboard/forgot"
        className="text-center text-sm text-ink-sand underline-offset-4 hover:text-ink-gold hover:underline"
      >
        نسيت كلمة المرور؟
      </Link>
    </form>
  );
}
