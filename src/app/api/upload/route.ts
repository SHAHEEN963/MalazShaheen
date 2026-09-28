import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { getSessionEmail } from "@/lib/auth/admin";

/**
 * Issues short-lived tokens so the dashboard can send a picture straight to
 * Vercel Blob from the browser.
 *
 * Server Actions cap the request body at 1MB, so routing an upload through one
 * made anything larger — an ordinary phone photo, say — fail inside the
 * framework before our own code ran, surfacing only as "a server error
 * occurred". Uploading from the client skips that limit entirely.
 *
 * The token is only minted for a signed-in admin, and it constrains what can
 * be written: image types only, and a size ceiling.
 */
const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;

const ALLOWED_CONTENT_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
  "image/gif",
  "image/svg+xml",
];

export async function POST(request: Request): Promise<Response> {
  const body = (await request.json()) as HandleUploadBody;

  try {
    const result = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname) => {
        const email = await getSessionEmail();
        if (!email) {
          throw new Error("غير مصرّح — سجّل الدخول أولًا.");
        }
        // The client only ever asks for uploads/…; refuse anything else so a
        // token can never be used to overwrite the content document.
        if (!pathname.startsWith("uploads/")) {
          throw new Error("مسار غير مسموح.");
        }
        return {
          allowedContentTypes: ALLOWED_CONTENT_TYPES,
          maximumSizeInBytes: MAX_UPLOAD_BYTES,
          addRandomSuffix: true,
        };
      },
      onUploadCompleted: async () => {
        // Nothing to record: the dashboard stores the returned URL when the
        // admin saves, so there is no separate database to keep in step.
      },
    });

    return Response.json(result);
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "تعذّر رفع الصورة." },
      { status: 400 }
    );
  }
}
