import type { Metadata } from "next";
import "@dawod/thmanyah-font-web/index.css";
import "../dashboard.css";

export const metadata: Metadata = {
  title: "لوحة التحكم — ملاذ شاهين",
  description: "تحرير محتوى الموقع.",
  // Keep the admin panel out of search results entirely.
  robots: { index: false, follow: false },
};

export default function DashboardRootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ar" dir="rtl">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
