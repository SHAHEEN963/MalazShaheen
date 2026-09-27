import { get } from "@vercel/blob";

/**
 * Serves an uploaded picture out of the Vercel Blob store.
 *
 * The store is public now, so new uploads are referenced by their blob URL
 * directly and never reach this route. It is kept so that any image saved
 * while the store was private — stored as /api/media/uploads/… — still
 * resolves instead of turning into a broken picture.
 *
 * Only the `uploads/` prefix is served.
 */
export async function GET(
  _request: Request,
  context: RouteContext<"/api/media/[...path]">
) {
  const { path } = await context.params;
  const pathname = path.join("/");

  // path segments are URL-decoded by Next, so "..", a leading slash or any
  // prefix other than uploads/ is refused rather than normalised.
  if (!pathname.startsWith("uploads/") || pathname.includes("..")) {
    return new Response("Not found", { status: 404 });
  }

  try {
    const result = await get(pathname, { access: "public" });

    if (!result || result.statusCode !== 200) {
      return new Response("Not found", { status: 404 });
    }

    return new Response(result.stream, {
      headers: {
        "Content-Type": result.blob.contentType || "application/octet-stream",
        // Filenames are random and never reused, so these can be cached hard.
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
