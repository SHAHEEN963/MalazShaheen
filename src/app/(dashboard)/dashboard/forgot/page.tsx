import { ForgotForm } from "./ForgotForm";

export default function ForgotPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-16">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <p className="text-2xl font-black text-ink-gold">ملاذ شاهين</p>
          <h1 className="mt-2 text-lg text-ink-sand">إعادة تعيين كلمة المرور</h1>
        </div>
        <ForgotForm />
      </div>
    </main>
  );
}
