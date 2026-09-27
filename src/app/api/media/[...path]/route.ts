import { get } from "@vercel/blob";

/**
 * Serves an uploaded picture out of the Vercel Blob store.
 *
 * The store is configured with **private** access, so blobs have no publicly
 * fetchable URL and `put({ access: "public" })` is rejected outright. Images
 * are therefore stored privately and streamed through here, which keeps the
 * store private while still letting the browser display them.
 *
 * Only the `uploads/` prefix is served: the content document lives at
 * `content/content.json` in the same store and must not be reachable this way.
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
    const result = await get(pathname, { access: "private" });

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
