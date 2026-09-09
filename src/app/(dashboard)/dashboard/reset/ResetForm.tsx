"use client";

import Link from "next/link";
import { useActionState } from "react";
import { resetPassword, type FormState } from "@/lib/auth/actions";

const initialState: FormState = {};

export function ResetForm({ token }: { token: string }) {
  const [state, formAction, pending] = useActionState(resetPassword, initialState);
  const done = Boolean(state.notice);

  if (!token) {
    return (
      <div className="dash-card flex flex-col gap-4 text-center">
        <p className="text-sm text-[var(--color-danger)]">
          الرابط غير مكتمل. اطلب رابطًا جديدًا.
        </p>
        <Link href="/dashboard/forgot" className="dash-btn dash-btn-ghost">
          طلب رابط جديد
        </Link>
      </div>
    );
  }

  return (
    <form action={formAction} className="dash-card flex flex-col gap-5">
      <input type="hidden" name="token" value={token} />

      <div>
        <label className="dash-label" htmlFor="password">
          كلمة المرور الجديدة
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          minLength={12}
          autoComplete="new-password"
          dir="ltr"
          className="dash-input text-start"
        />
        <p className="mt-1.5 text-xs text-ink-sand/70">١٢ حرفًا على الأقل.</p>
      </div>

      <div>
        <label className="dash-label" htmlFor="confirm">
          تأكيد كلمة المرور
        </label>
        <input
          id="confirm"
          name="confirm"
          type="password"
          required
          minLength={12}
          autoComplete="new-password"
          dir="ltr"
          className="dash-input text-start"
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

      {done ? (
        <Link href="/dashboard/login" className="dash-btn dash-btn-primary">
          تسجيل الدخول
        </Link>
      ) : (
        <button type="submit" className="dash-btn dash-btn-primary" disabled={pending}>
          {pending ? "جارٍ الحفظ…" : "حفظ كلمة المرور"}
        </button>
      )}
    </form>
  );
}
