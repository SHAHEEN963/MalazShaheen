"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { testimonials } from "@/lib/data";
import { RoomTag } from "../RoomTag";

/**
 * Room 06 — الأصوات.
 * The one bright room. Driven by the arrows (or a swipe / trackpad), never on
 * a timer — nobody should have to wait for a carousel to come back around.
 */
export function Voices() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const updateEdges = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    // In RTL, scrollLeft runs negative from 0 — normalise to a distance.
    const scrolled = Math.abs(el.scrollLeft);
    const max = el.scrollWidth - el.clientWidth;
    setAtStart(scrolled <= 4);
    setAtEnd(scrolled >= max - 4);
  }, []);

  useEffect(() => {
    updateEdges();
    const el = trackRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateEdges, { passive: true });
    window.addEventListener("resize", updateEdges);
    return () => {
      el.removeEventListener("scroll", updateEdges);
      window.removeEventListener("resize", updateEdges);
    };
  }, [updateEdges]);

  const nudge = useCallback((direction: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector("figure");
    const step = card ? card.getBoundingClientRect().width + 24 : 380;
    el.scrollBy({ left: direction * step, behavior: "smooth" });
  }, []);

  return (
    <section
      id="voices"
      className="relative z-10 overflow-hidden bg-stone-700/95 py-28 sm:py-36"
    >
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <div>
            <RoomTag index="٠٦" label="الأصوات" />
            <h2 className="mt-6 max-w-2xl font-display text-[clamp(1.9rem,5vw,3.2rem)] leading-tight text-ink-ivory">
              ما يقوله من حملوا أعمالي إلى بيوتهم
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => nudge(1)}
              disabled={atStart}
              aria-label="السابق"
              className="flex h-12 w-12 items-center justify-center rounded-full border border-ink-gold/45 text-lg text-ink-gold transition-colors hover:bg-ink-gold hover:text-stone-900 disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:bg-transparent disabled:hover:text-ink-gold"
            >
              →
            </button>
            <button
              type="button"
              onClick={() => nudge(-1)}
              disabled={atEnd}
              aria-label="التالي"
              className="flex h-12 w-12 items-center justify-center rounded-full border border-ink-gold/45 text-lg text-ink-gold transition-colors hover:bg-ink-gold hover:text-stone-900 disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:bg-transparent disabled:hover:text-ink-gold"
            >
              ←
            </button>
          </div>
        </div>
      </div>

      <div
        ref={trackRef}
        className="mt-14 flex snap-x snap-mandatory gap-6 overflow-x-auto px-6 pb-6 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {testimonials.map((quote) => (
          <figure
            key={quote.name}
            className="w-[320px] shrink-0 snap-start border border-ink-ivory/12 bg-stone-850 p-8 transition-transform duration-500 hover:-translate-y-2 sm:w-[420px]"
          >
            <span
              aria-hidden="true"
              className="font-display block text-5xl leading-none text-ink-gold/60"
            >
              ”
            </span>
            <blockquote className="mt-4 font-editorial text-lg leading-[1.9] text-ink-ivory/90">
              {quote.quote}
            </blockquote>
            <figcaption className="mt-6 flex items-center gap-3">
              <span className="h-px w-8 bg-ink-gold" />
              <span>
                <span className="block font-ui text-sm font-bold text-ink-gold-light">
                  {quote.name}
                </span>
                <span className="block font-ui text-xs text-ink-sand/70">
                  {quote.role}
                </span>
              </span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
