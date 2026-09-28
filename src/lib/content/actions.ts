"use server";

import { promises as fs } from "node:fs";
import { randomUUID } from "node:crypto";
import path from "node:path";
import { del, put } from "@vercel/blob";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/admin";
import { getContent, saveContent } from "./store";
import type { SiteContent } from "./types";

export type SaveResult = { ok: boolean; message: string };

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");
const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;
const ALLOWED_TYPES: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/avif": ".avif",
  "image/gif": ".gif",
  "image/svg+xml": ".svg",
  "application/pdf": ".pdf",
};

/** Persists the whole document and refreshes the public page. */
export async function saveSiteContent(content: SiteContent): Promise<SaveResult> {
  await requireAdmin();

  try {
    await saveContent(content);
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "تعذّر الحفظ.",
    };
  }

  // The public page is statically rendered; this pushes the new content live.
  revalidatePath("/", "layout");
  revalidatePath("/dashboard");

  return { ok: true, message: "تم الحفظ." };
}

export async function loadSiteContent(): Promise<SiteContent> {
  await requireAdmin();
  return getContent();
}

export type UploadResult = { ok: boolean; path?: string; message: string };

/** Stores one image under public/uploads and returns its public path. */
export async function uploadImage(formData: FormData): Promise<UploadResult> {
  await requireAdmin();

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { ok: false, message: "لم يُختَر ملف." };
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    return { ok: false, message: "حجم الصورة أكبر من ١٠ ميغابايت." };
  }

  const extension = ALLOWED_TYPES[file.type];
  if (!extension) {
    return { ok: false, message: "صيغة غير مدعومة. استخدم صورة أو ملف PDF." };
  }

  // Generated name: never trust the client-supplied filename for a path.
  const filename = `${randomUUID()}${extension}`;

  try {
    if (process.env.VERCEL) {
      // The deployment filesystem is read-only (writing there failed with
      // ENOENT on /var/task/public), so images go to Vercel Blob.
      //
      // The store is public, so the returned URL is loadable by the browser
      // directly and no proxy is involved.
      const blob = await put(`uploads/${filename}`, file, {
        access: "public",
        contentType: file.type,
      });
      return { ok: true, path: blob.url, message: "تم رفع الصورة." };
    }

    await fs.mkdir(UPLOAD_DIR, { recursive: true });
    const bytes = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(path.join(UPLOAD_DIR, filename), bytes);
    return { ok: true, path: `/uploads/${filename}`, message: "تم رفع الصورة." };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "تعذّر رفع الصورة.",
    };
  }
}

/** Removes an uploaded file that is no longer referenced. */
export async function deleteUpload(publicPath: string): Promise<SaveResult> {
  await requireAdmin();

  // Blob-backed images: either a full URL, or the /api/media path that maps
  // onto a pathname inside the store.
  const blobTarget = /^https?:\/\//.test(publicPath)
    ? publicPath
    : publicPath.startsWith("/api/media/")
      ? publicPath.slice("/api/media/".length)
      : null;

  if (blobTarget) {
    try {
      await del(blobTarget);
      return { ok: true, message: "حُذفت الصورة." };
    } catch {
      return { ok: true, message: "الصورة غير موجودة أصلًا." };
    }
  }

  // Otherwise only ever touch files directly inside public/uploads.
  const name = path.basename(publicPath);
  if (!publicPath.startsWith("/uploads/") || name !== publicPath.slice("/uploads/".length)) {
    return { ok: false, message: "مسار غير صالح." };
  }

  try {
    await fs.unlink(path.join(UPLOAD_DIR, name));
    return { ok: true, message: "حُذفت الصورة." };
  } catch {
    return { ok: true, message: "الصورة غير موجودة أصلًا." };
  }
}
