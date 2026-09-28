import { get } from "@vercel/blob";
import { getSessionEmail } from "@/lib/auth/admin";
import { getContent } from "@/lib/content/store";

/**
 * Reports exactly what the content read does, because a failure used to fall
 * back to the bundled seed silently — the site simply showed older content
 * with no signal that anything had gone wrong.
 *
 * Admin only. Reports whether secrets are present, never their values.
 */
export const dynamic = "force-dynamic";

export async function GET() {
  const email = await getSessionEmail();
  if (!email) return new Response("Unauthorized", { status: 401 });

  const report: Record<string, unknown> = {
    onVercel: Boolean(process.env.VERCEL),
    hasBlobToken: Boolean(process.env.BLOB_READ_WRITE_TOKEN),
    hasStoreId: Boolean(process.env.BLOB_STORE_ID),
  };

  // 1. the raw blob read, with whatever it actually returns or throws
  try {
    const result = await get("content/content.json", {
      access: "public",
      useCache: false,
    });
    report.rawGet = result
      ? { statusCode: result.statusCode, size: result.blob?.size ?? null }
      : "returned null";
    if (result?.statusCode === 200) {
      const text = await new Response(result.stream).text();
      const parsed = JSON.parse(text) as { testimonials?: unknown[] };
      report.blobTestimonials = parsed.testimonials?.length ?? null;
      report.blobBytes = text.length;
    }
  } catch (error) {
    report.rawGet = {
      threw: error instanceof Error ? error.name : "unknown",
      message: error instanceof Error ? error.message.slice(0, 300) : String(error),
    };
  }

  // 2. what the site's own loader ends up with
  try {
    const content = await getContent();
    report.getContentTestimonials = content.testimonials.length;
    report.getContentArtistTitle = content.artist.title;
  } catch (error) {
    report.getContent = error instanceof Error ? error.message.slice(0, 300) : "failed";
  }

  return Response.json(report, {
    headers: { "Cache-Control": "no-store" },
  });
}
