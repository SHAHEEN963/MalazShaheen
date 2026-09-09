import { ResetForm } from "./ResetForm";

export default async function ResetPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-16">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <p className="text-2xl font-black text-ink-gold">ملاذ شاهين</p>
          <h1 className="mt-2 text-lg text-ink-sand">كلمة مرور جديدة</h1>
        </div>
        <ResetForm token={token ?? ""} />
      </div>
    </main>
  );
}
