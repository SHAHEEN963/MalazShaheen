import { redirect } from "next/navigation";
import { getSessionEmail } from "@/lib/auth/admin";
import { LoginForm } from "./LoginForm";

export default async function LoginPage() {
  // Already signed in? Skip the form.
  if (await getSessionEmail()) redirect("/dashboard");

  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-16">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <p className="text-2xl font-black text-ink-gold">ملاذ شاهين</p>
          <h1 className="mt-2 text-lg text-ink-sand">لوحة التحكم</h1>
        </div>
        <LoginForm />
      </div>
    </main>
  );
}
