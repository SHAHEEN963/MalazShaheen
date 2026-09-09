import type { Metadata } from "next";
import "@dawod/thmanyah-font-web/index.css";
import "../globals.css";
import { getContent } from "@/lib/content/store";

/** Title and description are editable from the dashboard. */
export async function generateMetadata(): Promise<Metadata> {
  const { meta } = await getContent();
  return { title: meta.title, description: meta.description };
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ar" dir="rtl">
      <body className="bg-ink-charcoal text-ink-ivory antialiased">
        {children}
      </body>
    </html>
  );
}
