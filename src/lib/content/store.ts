import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";
import { get, put } from "@vercel/blob";
import { defaultContent } from "./defaults";
import contentSeed from "../../../data/content.json";
import type { SiteContent } from "./types";

/**
 * The repository's own data/content.json, bundled at build time.
 *
 * A Blob store starts empty, so pointing the project at a new one would
 * otherwise drop the site back to the shipped defaults. This seed is layered
 * over those defaults whenever the store has nothing yet; the moment the
 * dashboard saves, the store takes over.
 */
const seedContent: SiteContent = mergeWithDefaults(
  defaultContent,
  contentSeed as unknown
);

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

/**
 * Guarantees every record has the fields the components read.
 *
 * mergeWithDefaults takes arrays wholesale, so it never reaches inside a saved
 * `works` entry. Content written before a field existed therefore arrives
 * missing it — which is how a work saved before `items` crashed the gallery on
 * click. Normalising on read keeps older documents renderable.
 */
function normalise(content: SiteContent): SiteContent {
  const works = Array.isArray(content.works) ? content.works : [];
  const testimonials = Array.isArray(content.testimonials)
    ? content.testimonials
    : [];

  return {
    ...content,
    works: works.map((work, i) => ({
      ...work,
      id: work?.id ?? `work-${i}`,
      title: work?.title ?? "",
      category: work?.category ?? "",
      year: work?.year ?? "",
      description: work?.description ?? "",
      image: work?.image ?? "",
      items: (Array.isArray(work?.items) ? work.items : []).map((item, j) => ({
        id: item?.id ?? `item-${i}-${j}`,
        image: item?.image ?? "",
        title: item?.title ?? "",
        description: item?.description ?? "",
      })),
    })),
    // Reviews are pictures now; anything saved in the old text shape has no
    // image and simply drops out rather than rendering an empty frame.
    testimonials: testimonials.map((review, i) => ({
      id: review?.id ?? `review-${i}`,
      image: review?.image ?? "",
      caption: review?.caption ?? "",
    })),
  };
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
        access: "public",
        useCache: false,
      });

      if (!result || result.statusCode !== 200) {
        // Loud on purpose: falling back here serves older content, and doing
        // that silently made a saved review look like it had vanished.
        console.error(
          "[content] blob read did not return 200:",
          result ? result.statusCode : "null result",
          "— serving the bundled seed instead"
        );
        return normalise(seedContent);
      }

      const raw = await new Response(result.stream).text();

      return normalise(mergeWithDefaults(defaultContent, JSON.parse(raw)));
    } catch (error) {
      console.error(
        "[content] blob read failed:",
        error instanceof Error ? error.message : error,
        "— serving the bundled seed instead"
      );
      return normalise(seedContent);
    }
  }

  try {
    const raw = await fs.readFile(CONTENT_FILE, "utf8");
    return normalise(mergeWithDefaults(defaultContent, JSON.parse(raw)));
  } catch {
    return normalise(seedContent);
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
      access: "public",
      allowOverwrite: true,
    });

    return;
  }

  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(CONTENT_FILE, json, "utf8");
}