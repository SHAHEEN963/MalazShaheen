"use client";

import { useCallback, useEffect, useState } from "react";
import type { SiteContent } from "@/lib/content/types";
import { RoomTag } from "../RoomTag";
import { ArrowIcon } from "../ArrowIcon";

/**
 * Room 06 — الأصوات.
 * Reviews are published as pictures (screenshots of what clients sent), shown
 * one at a time in a 16:9 frame with the arrows either side of it. Arrows and
 * keyboard both drive it; there is no timer.
 */
export function Voices({
  testimonials,
  copy,
}: {
  testimonials: SiteContent["testimonials"];
  copy: SiteContent["sections"]["voices"];
}) {
  const slides = testimonials.filter((t) => t.image);
  const [index, setIndex] = useState(0);

  const go = useCallback(
    (direction: 1 | -1) => {
      setIndex((i) => (i + direction + slides.length) % slides.length);
    },
    [slides.length]
  );

  useEffect(() => {
    if (slides.length < 2) return;
    const onKey = (e: KeyboardEvent) => {
      // RTL: ArrowRight moves to the previous slide.
      if (e.key === "ArrowRight") go(-1);
      if (e.key === "ArrowLeft") go(1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, slides.length]);

  // Nothing uploaded yet — leave the room out rather than show an empty frame.
  if (slides.length === 0) return null;

  const current = slides[Math.min(index, slides.length - 1)];
  // Desktop: outlined arrows either side of the frame.
  const arrow =
    "hidden h-12 w-12 shrink-0 items-center justify-center rounded-full border border-ink-gold/45 text-lg text-ink-gold transition-colors hover:bg-ink-gold hover:text-stone-900 sm:flex";
  // Phone: solid gold arrows under the dots, clear of the picture.
  const phoneArrow =
    "flex h-12 w-12 items-center justify-center rounded-full bg-ink-gold text-stone-900 shadow-[0_8px_24px_-6px_rgba(0,0,0,0.75)] transition-transform active:scale-95";

  return (
    <section
      id="voices"
      className="relative z-10 overflow-hidden bg-stone-700/95 py-28 sm:py-36"
    >
      <div className="mx-auto max-w-6xl px-6">
        {/* the frame below breaks out to the phone's edges, less a margin */}
        <RoomTag index="٠٦" label={copy.label} />
        <h2 className="mt-6 max-w-2xl font-display md:max-w-none md:whitespace-nowrap text-[clamp(1.9rem,5vw,3.2rem)] leading-tight text-ink-ivory">
          {copy.heading}
        </h2>

        <div className="-mx-2 mt-12 flex items-center gap-6 sm:mx-auto sm:max-w-5xl">
          {slides.length > 1 && (
            <button type="button" onClick={() => go(-1)} aria-label="السابق" className={arrow}>
              →
            </button>
          )}

          {/* Same 16:9 window for every review, framed in a fine gold line */}
          <div
            className="relative aspect-[16/9] min-w-0 flex-1 overflow-hidden rounded-sm border border-ink-gold/70 bg-stone-950 p-1 shadow-[0_40px_90px_-40px_rgba(0,0,0,0.9)]"
            aria-live="polite"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              key={current.id}
              src={current.image}
              alt={current.caption || "تقييم عميل"}
              className="h-full w-full object-contain"
            />
          </div>

          {slides.length > 1 && (
            <button type="button" onClick={() => go(1)} aria-label="التالي" className={arrow}>
              ←
            </button>
          )}
        </div>

        {slides.length > 1 && (
          <div className="mt-6 flex items-center justify-center gap-2">
            {slides.map((slide, i) => (
              <button
                key={slide.id}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`التقييم ${i + 1}`}
                aria-current={i === index}
                className={`h-1.5 rounded-full transition-all ${
                  i === index ? "w-8 bg-ink-gold" : "w-1.5 bg-ink-ivory/30 hover:bg-ink-gold/60"
                }`}
              />
            ))}
          </div>
        )}

        {slides.length > 1 && (
          <div className="mt-8 flex items-center justify-center gap-6 sm:hidden">
            <button type="button" onClick={() => go(-1)} aria-label="السابق" className={phoneArrow}>
              <ArrowIcon />
            </button>
            <button type="button" onClick={() => go(1)} aria-label="التالي" className={phoneArrow}>
              <ArrowIcon flip />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

