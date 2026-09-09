import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";
import { defaultContent } from "./defaults";
import type { SiteContent } from "./types";

const DATA_DIR = path.join(process.cwd(), "data");
const CONTENT_FILE = path.join(DATA_DIR, "content.json");

/**
 * Whether saved content can actually persist.
 *
 * On Vercel the deployment filesystem is read-only and /tmp is per-instance and
 * wiped between invocations, so a "successful" write there would silently
 * vanish. We report false rather than pretend it worked; the dashboard shows a
 * banner and the editor stays usable locally.
 */
export function isWritable(): boolean {
  return !process.env.VERCEL;
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/**
 * Fills in anything missing from a saved file using the defaults. Arrays are
 * taken wholesale from the saved file (an empty list is a real edit, not a gap),
 * while objects are merged key by key so new fields added in code appear
 * automatically for content saved by an older version.
 */
function mergeWithDefaults<T>(base: T, saved: unknown): T {
  if (!isPlainObject(saved) || !isPlainObject(base)) {
    return (saved === undefined ? base : (saved as T));
  }
  const out: Record<string, unknown> = { ...base };
  for (const key of Object.keys(base as Record<string, unknown>)) {
    const baseValue = (base as Record<string, unknown>)[key];
    const savedValue = saved[key];
    if (savedValue === undefined) continue;
    out[key] = Array.isArray(baseValue)
      ? savedValue
      : mergeWithDefaults(baseValue, savedValue);
  }
  return out as T;
}

/** Reads the saved content, or the shipped defaults when nothing is saved yet. */
export async function getContent(): Promise<SiteContent> {
  try {
    const raw = await fs.readFile(CONTENT_FILE, "utf8");
    return mergeWithDefaults(defaultContent, JSON.parse(raw));
  } catch {
    // No file yet, or unreadable/corrupt JSON — fall back to a complete site
    // rather than crashing the public page.
    return defaultContent;
  }
}

/** Persists content. Throws (with an Arabic message) when persistence is impossible. */
export async function saveContent(content: SiteContent): Promise<void> {
  if (!isWritable()) {
    throw new Error(
      "التخزين غير متاح في بيئة النشر الحالية — التعديلات لن تُحفظ. راجع قسم التخزين في README."
    );
  }
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(CONTENT_FILE, JSON.stringify(content, null, 2) + "\n", "utf8");
}
