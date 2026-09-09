import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";
import { get, put } from "@vercel/blob";
import { defaultContent } from "./defaults";
import type { SiteContent } from "./types";

const DATA_DIR = path.join(process.cwd(), "data");
const CONTENT_FILE = path.join(DATA_DIR, "content.json");

const BLOB_CONTENT_FILE = "content/content.json";

/**
 * Locally we save to data/content.json.
 * On Vercel we save to Vercel Blob.
 */
export function isWritable(): boolean {
  return true;
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function mergeWithDefaults<T>(base: T, saved: unknown): T {
  if (!isPlainObject(saved) || !isPlainObject(base)) {
    return saved === undefined ? base : (saved as T);
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

/**
 * Reads content from Vercel Blob in production,
 * or from data/content.json locally.
 */
export async function getContent(): Promise<SiteContent> {
  if (process.env.VERCEL) {
    try {
      const result = await get(BLOB_CONTENT_FILE, {
        access: "private",
        useCache: false,
      });

      if (!result || result.statusCode !== 200) {
        return defaultContent;
      }

      const raw = await new Response(result.stream).text();

      return mergeWithDefaults(defaultContent, JSON.parse(raw));
    } catch {
      return defaultContent;
    }
  }

  try {
    const raw = await fs.readFile(CONTENT_FILE, "utf8");
    return mergeWithDefaults(defaultContent, JSON.parse(raw));
  } catch {
    return defaultContent;
  }
}

/**
 * Saves content to Vercel Blob in production,
 * or to data/content.json locally.
 */
export async function saveContent(content: SiteContent): Promise<void> {
  const json = JSON.stringify(content, null, 2) + "\n";

  if (process.env.VERCEL) {
    await put(BLOB_CONTENT_FILE, json, {
      access: "private",
      allowOverwrite: true,
    });

    return;
  }

  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(CONTENT_FILE, json, "utf8");
}