"use client";

import { useCallback, useEffect, useState } from "react";
import type { SiteContent } from "@/lib/content/types";
import { RoomTag } from "../RoomTag";

/**
 * Room 06 — الأصوات.
 * Reviews are published as pictures (screenshots of what clients sent), shown
 * one at a time in a wide 16:9 frame. Arrows and keyboard both drive it; there
 * is no timer, so nobody waits for a slide to come back around.
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

  return (
    <section
      id="voices"
      className="relative z-10 overflow-hidden bg-stone-700/95 py-28 sm:py-36"
    >
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <div>
            <RoomTag index="٠٦" label={copy.label} />
            <h2 className="mt-6 max-w-2xl font-display text-[clamp(1.9rem,5vw,3.2rem)] leading-tight text-ink-ivory">
              {copy.heading}
            </h2>
          </div>

          {slides.length > 1 && (
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => go(-1)}
                aria-label="السابق"
                className="flex h-12 w-12 items-center justify-center rounded-full border border-ink-gold/45 text-lg text-ink-gold transition-colors hover:bg-ink-gold hover:text-stone-900"
              >
                →
              </button>
              <span className="font-ui text-sm tabular-nums text-ink-sand">
                {index + 1} / {slides.length}
              </span>
              <button
                type="button"
                onClick={() => go(1)}
                aria-label="التالي"
                className="flex h-12 w-12 items-center justify-center rounded-full border border-ink-gold/45 text-lg text-ink-gold transition-colors hover:bg-ink-gold hover:text-stone-900"
              >
                ←
              </button>
            </div>
          )}
        </div>

        {/* Wide frame — every review sits in the same 16:9 window */}
        <div
          className="relative mt-12 aspect-[16/9] w-full overflow-hidden rounded-sm border border-ink-gold/30 bg-stone-950 shadow-[0_40px_90px_-40px_rgba(0,0,0,0.9)]"
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
          <div className="mt-6 flex justify-center gap-2">
            {slides.map((slide, i) => (
              <button
                key={slide.id}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`التقييم ${i + 1}`}
                aria-current={i === index}
                className={`h-1.5 w-8 rounded-full transition-colors ${
                  i === index ? "bg-ink-gold" : "bg-ink-ivory/25 hover:bg-ink-gold/60"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
