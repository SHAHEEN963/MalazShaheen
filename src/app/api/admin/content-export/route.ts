import { getSessionEmail } from "@/lib/auth/admin";
import { getContent } from "@/lib/content/store";

/**
 * Downloads the live content document as JSON.
 *
 * Exists so the content held in one Blob store can be rescued before the
 * project is pointed at a different store — a new store starts empty, and
 * without this the site would silently fall back to the shipped defaults.
 * Doubles as a plain backup.
 *
 * Admin only: the document is served to a signed-in session and nobody else.
 */
export async function GET() {
  const email = await getSessionEmail();
  if (!email) {
    return new Response("Unauthorized", { status: 401 });
  }

  const content = await getContent();

  return new Response(JSON.stringify(content, null, 2), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Content-Disposition": 'attachment; filename="content.json"',
      "Cache-Control": "no-store",
    },
  });
}
