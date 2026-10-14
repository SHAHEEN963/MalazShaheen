"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import type { SiteContent } from "@/lib/content/types";
import { useIsCoarseOrSmall, useReducedMotion } from "@/lib/useReducedMotion";
import { RoomTag } from "../RoomTag";

/**
 * Room 03 — المعرض.
 * A cover-flow carousel: the current work stands at the centre, its
 * neighbours recede to either side, angled toward it. Cards are 4:5 (the
 * 1080×1350 portrait format), and the pointer tilts a card in 3D on hover.
 * Opening a work keeps the existing detail view.
 */
export function Gallery({
  works,
  copy,
}: {
  works: SiteContent["works"];
  copy: SiteContent["sections"]["gallery"];
}) {
  const isSmall = useIsCoarseOrSmall();
  const reducedMotion = useReducedMotion();
  const canTilt = !isSmall && !reducedMotion;
  const count = works.length;

  const [activeIndex, setActiveIndex] = useState(0);
  const [openId, setOpenId] = useState<string | null>(null);
  const dragStart = useRef<number | null>(null);

  const activeWork = works.find((w) => w.id === openId) ?? null;
  const [slideIndex, setSlideIndex] = useState(0);

  /**
   * The work's own cover leads, then the pieces added to it. A work with no
   * pieces is simply a single slide. (`items` is guarded: content saved before
   * that field existed lacks it.)
   */
  const slides = activeWork
    ? [
        {
          id: `${activeWork.id}-cover`,
          image: activeWork.image,
          title: activeWork.title,
          description: activeWork.description,
        },
        ...(Array.isArray(activeWork.items) ? activeWork.items : []),
      ]
    : [];

  const slide = slides[Math.min(slideIndex, Math.max(slides.length - 1, 0))];

  const slideCount = slides.length;
  const stepSlide = useCallback(
    (direction: 1 | -1) => {
      setSlideIndex((i) =>
        slideCount > 0 ? (i + direction + slideCount) % slideCount : 0
      );
    },
    [slideCount]
  );

  // Opening a work always starts on its first piece.
  const openWork = useCallback((id: string) => {
    setOpenId(id);
    setSlideIndex(0);
  }, []);

  const step = useCallback(
    (direction: 1 | -1) => {
      if (count === 0) return;
      setActiveIndex((i) => (i + direction + count) % count);
    },
    [count]
  );

  useEffect(() => {
    if (!openId) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenId(null);
      // RTL: ArrowRight steps back through the pieces of this work.
      if (e.key === "ArrowRight") stepSlide(-1);
      if (e.key === "ArrowLeft") stepSlide(1);
    };
    // Any attempt to scroll the page dismisses the work, so the reader is
    // never left fighting a locked page to get back to the gallery.
    const closeOnScroll = () => setOpenId(null);

    window.addEventListener("keydown", onKey);
    window.addEventListener("wheel", closeOnScroll, { passive: true });
    window.addEventListener("touchmove", closeOnScroll, { passive: true });
    document.body.style.overflow = "hidden";
    // Lets the room rail step aside while a work is being read.
    document.documentElement.classList.add("work-open");

    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("wheel", closeOnScroll);
      window.removeEventListener("touchmove", closeOnScroll);
      document.body.style.overflow = "";
      document.documentElement.classList.remove("work-open");
    };
  }, [openId, stepSlide]);

  /** Shortest signed distance from the active card, so the ring wraps. */
  function offsetOf(i: number) {
    let d = i - activeIndex;
    if (d > count / 2) d -= count;
    if (d < -count / 2) d += count;
    return d;
  }

  /** Tilts the hovered card toward the pointer. Written straight to the
   *  element so moving the mouse never re-renders the carousel. */
  function tilt(event: React.MouseEvent<HTMLElement>) {
    if (!canTilt) return;
    const el = event.currentTarget;
    const r = el.getBoundingClientRect();
    const px = (event.clientX - r.left) / r.width - 0.5;
    const py = (event.clientY - r.top) / r.height - 0.5;
    el.style.transform = `rotateY(${px * 18}deg) rotateX(${-py * 12}deg) translateZ(24px)`;
  }

  function untilt(event: React.MouseEvent<HTMLElement>) {
    event.currentTarget.style.transform = "";
  }

  const spacing = isSmall ? 150 : 260;

  return (
    <section
      id="works"
      className="relative z-10 overflow-hidden bg-[linear-gradient(180deg,rgba(42,42,39,0.94),rgba(35,35,33,0.88)_45%,rgba(42,42,39,0.94))] py-28 sm:py-36"
    >
      <div className="relative mx-auto max-w-6xl px-6">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <RoomTag index="٠٣" label={copy.label} />
            <h2 className="mt-6 font-display text-[clamp(2rem,5vw,3.4rem)] text-ink-ivory">
              {copy.heading}
            </h2>
          </div>
          <span className="font-ui text-sm tabular-nums text-ink-sand">
            {count > 0 ? activeIndex + 1 : 0} / {count}
          </span>
        </div>
      </div>

      {/* The carousel */}
      <div
        className="relative mt-14 h-[400px] touch-pan-y select-none sm:h-[520px]"
        style={{ perspective: "1600px" }}
        onPointerDown={(e) => (dragStart.current = e.clientX)}
        onPointerUp={(e) => {
          if (dragStart.current === null) return;
          const dx = e.clientX - dragStart.current;
          dragStart.current = null;
          // RTL: dragging toward the left brings the next work in.
          if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1);
        }}
      >
        {works.map((work, i) => {
          const d = offsetOf(i);
          const abs = Math.abs(d);
          const visible = abs <= 2;
          const isActive = d === 0;
          return (
            <button
              key={work.id}
              type="button"
              onClick={() => (isActive ? openWork(work.id) : setActiveIndex(i))}
              aria-label={`${work.title} — ${work.category}`}
              aria-current={isActive}
              tabIndex={visible ? 0 : -1}
              className="absolute left-1/2 top-1/2 block aspect-[4/5] w-[240px] sm:w-[340px]"
              style={{
                // Positive offsets sit to the left: the reading direction is RTL.
                transform: `translate(-50%,-50%) translateX(${-d * spacing}px) scale(${
                  1 - abs * 0.14
                }) rotateY(${d * 14}deg)`,
                zIndex: 10 - abs,
                opacity: visible ? 1 - abs * 0.28 : 0,
                pointerEvents: visible ? "auto" : "none",
                transition:
                  "transform 0.7s cubic-bezier(0.22,1,0.36,1), opacity 0.5s ease",
                transformStyle: "preserve-3d",
              }}
            >
              <span
                onMouseMove={tilt}
                onMouseLeave={untilt}
                className={`relative flex h-full w-full flex-col justify-between overflow-hidden rounded-sm border text-start shadow-[0_40px_80px_-30px_rgba(0,0,0,0.9)] transition-transform duration-300 ease-out ${
                  isActive ? "border-ink-gold/60" : "border-ink-gold/15"
                } bg-stone-900`}
                style={{ transformStyle: "preserve-3d" }}
              >
                {work.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={work.image}
                    alt=""
                    aria-hidden="true"
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                ) : (
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 flex items-center justify-center font-display text-[6rem] text-ink-ivory/[0.07]"
                  >
                    {work.title.slice(0, 1)}
                  </span>
                )}
                <span
                  aria-hidden="true"
                  className="absolute inset-0 bg-[linear-gradient(to_top,rgba(20,20,18,0.92),rgba(20,20,18,0.15)_55%,transparent)]"
                />
                {!isActive && (
                  <span aria-hidden="true" className="absolute inset-0 bg-stone-950/35" />
                )}

                <span className="relative m-4 self-end rounded-sm border border-ink-ivory/30 px-2 py-1 font-ui text-[0.68rem] text-ink-ivory/85">
                  {work.category}
                </span>
                <span className="relative p-5 sm:p-6">
                  <span className="block font-display text-2xl leading-tight text-ink-ivory sm:text-3xl">
                    {work.title}
                  </span>
                  <span className="mt-3 block h-px w-12 bg-ink-gold" />
                  <span className="mt-3 block font-ui text-xs text-ink-sand">
                    {isActive ? copy.cardHint : work.year}
                  </span>
                </span>
              </span>
            </button>
          );
        })}

        {count > 1 && (
          <>
            <button
              type="button"
              onClick={() => step(-1)}
              aria-label="العمل السابق"
              className="absolute right-3 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-ink-gold/40 bg-stone-950/60 text-ink-gold backdrop-blur transition-colors hover:bg-ink-gold hover:text-stone-900 sm:right-[calc(50%-15.5rem)]"
            >
              →
            </button>
            <button
              type="button"
              onClick={() => step(1)}
              aria-label="العمل التالي"
              className="absolute left-3 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-ink-gold/40 bg-stone-950/60 text-ink-gold backdrop-blur transition-colors hover:bg-ink-gold hover:text-stone-900 sm:left-[calc(50%-15.5rem)]"
            >
              ←
            </button>
          </>
        )}
      </div>

      {count > 1 && (
        <div className="mt-8 flex justify-center gap-2">
          {works.map((work, i) => (
            <button
              key={work.id}
              type="button"
              onClick={() => setActiveIndex(i)}
              aria-label={`العمل ${i + 1}`}
              aria-current={i === activeIndex}
              className={`h-1.5 rounded-full transition-all ${
                i === activeIndex ? "w-8 bg-ink-gold" : "w-1.5 bg-ink-ivory/30"
              }`}
            />
          ))}
        </div>
      )}
      {/* Rendered into <body>: <main> carries z-10, which boxes every z-index
          inside it, so the nav (z-60) and the room rail (z-55) painted over
          this dialog no matter how high its own z-index went. */}
      {typeof document !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {activeWork && slide && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] bg-stone-950/80 backdrop-blur-md"
            onClick={() => setOpenId(null)}
            role="dialog"
            aria-modal="true"
            aria-label={activeWork.title}
          >
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="absolute inset-0 grid grid-cols-1 bg-stone-900 md:grid-cols-2"
            >
              <button
                type="button"
                onClick={() => setOpenId(null)}
                aria-label="إغلاق"
                className="absolute start-8 top-8 font-ui text-sm text-ink-sand transition-colors hover:text-ink-gold"
              >
                إغلاق ✕
              </button>

              {/* Picture fills the far column; the text keeps its own half. */}
              <div className="relative order-1 min-h-[34vh] bg-stone-950 md:order-2 md:min-h-0">
                {slide.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={slide.id}
                    src={slide.image}
                    alt={slide.title}
                    className="absolute inset-0 h-full w-full object-contain p-4 md:p-8"
                  />
                ) : (
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 flex items-center justify-center font-display text-[6rem] text-ink-ivory/10"
                  >
                    {slide.title.slice(0, 1)}
                  </span>
                )}
              </div>

              <div className="order-2 flex flex-col justify-center gap-5 overflow-y-auto px-8 py-14 md:order-1 md:px-14">
              <span className="font-ui text-xs tracking-wide text-ink-gold">
                {activeWork.category} · {activeWork.year}
              </span>
              <h3 className="font-display text-[clamp(1.7rem,5vw,3rem)] leading-tight text-ink-ivory">
                {slide.title}
              </h3>
              <div className="rule-gold" />
              <p className="font-editorial text-lg leading-[1.9] text-ink-sand">
                {slide.description}
              </p>

              {/* Move between the pieces that make up this one work */}
              {slides.length > 1 && (
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => stepSlide(-1)}
                    aria-label="القطعة السابقة"
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-ink-gold/40 text-ink-gold transition-colors hover:bg-ink-gold hover:text-stone-900"
                  >
                    →
                  </button>
                  <span className="font-ui text-sm tabular-nums text-ink-sand">
                    {slideIndex + 1} / {slides.length}
                  </span>
                  <button
                    type="button"
                    onClick={() => stepSlide(1)}
                    aria-label="القطعة التالية"
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-ink-gold/40 text-ink-gold transition-colors hover:bg-ink-gold hover:text-stone-900"
                  >
                    ←
                  </button>
                </div>
              )}

              {/* Close on the way out, or the work would stay open behind
                  the contact section the link jumps to. */}
              <a
                href="#contact"
                onClick={() => setOpenId(null)}
                className="btn btn-ghost mt-2 self-start"
              >
                {copy.detailCta}
              </a>
              </div>
            </motion.div>
          </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </section>
  );
}
