import { getContent } from "@/lib/content/store";

/**
 * Streams the uploaded CV as a download.
 *
 * The file lives on the blob CDN, and a plain `<a download>` pointing at
 * another origin is ignored by browsers — they navigate to the PDF instead of
 * saving it. Serving it from our own origin with an attachment disposition
 * makes the button actually download.
 */
export const dynamic = "force-dynamic";

export async function GET() {
  const { artist } = await getContent();

  if (!artist.cv) {
    return new Response("لم تُرفع سيرة ذاتية بعد.", {
      status: 404,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  // A stored path may be local (/uploads/…) or an absolute blob URL.
  const source = artist.cv.startsWith("http")
    ? artist.cv
    : new URL(artist.cv, process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : "http://localhost:3000"
      ).toString();

  try {
    const upstream = await fetch(source, { cache: "no-store" });
    if (!upstream.ok || !upstream.body) {
      return new Response("تعذّر جلب الملف.", { status: 502 });
    }

    const filename = `${artist.name} — CV.pdf`;
    return new Response(upstream.body, {
      headers: {
        "Content-Type": "application/pdf",
        // RFC 5987 so the Arabic name survives the header.
        "Content-Disposition": `attachment; filename="cv.pdf"; filename*=UTF-8''${encodeURIComponent(filename)}`,
        "Cache-Control": "no-store",
      },
    });
  } catch {
    return new Response("تعذّر جلب الملف.", { status: 502 });
  }
}
