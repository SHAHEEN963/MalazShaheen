import { redirect } from "next/navigation";
import { getSessionEmail } from "@/lib/auth/admin";
import { logout } from "@/lib/auth/actions";
import { getContent, isWritable } from "@/lib/content/store";
import { Editor } from "./_components/Editor";

// Reads cookies and the content file on every request.
export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  // The proxy already redirects signed-out visitors; this is the real check.
  const email = await getSessionEmail();
  if (!email) redirect("/dashboard/login");

  const content = await getContent();
  const writable = isWritable();

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <header className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <h1 className="text-xl text-ink-gold">لوحة التحكم</h1>
          <p className="mt-1 text-sm text-ink-sand/80" dir="ltr" style={{ textAlign: "start" }}>
            {email}
          </p>
        </div>
        <form action={logout}>
          <button type="submit" className="dash-btn dash-btn-ghost">
            تسجيل الخروج
          </button>
        </form>
      </header>

      <Editor
        initialContent={content}
        writable={writable}
        storageNotice="التخزين للقراءة فقط في بيئة النشر هذه، لذلك لن تُحفظ التعديلات. حرّر المحتوى محليًا ثم ارفعه بـ git، أو اربط مخزنًا دائمًا (راجع README)."
      />
    </div>
  );
}
