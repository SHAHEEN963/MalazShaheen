import type { Metadata } from "next";
import "@dawod/thmanyah-font-web/index.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "ملاذ شاهين — خطاط وفنان الخط العربي",
  description:
    "أعمال خط عربي مخصّصة للأعراس والعلامات التجارية والقطع الخاصة — خطّا الثلث والديواني الكلاسيكيان بخط اليد.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ar" dir="rtl">
      <body className="bg-ink-charcoal text-ink-ivory antialiased">
        {children}
      </body>
    </html>
  );
}
