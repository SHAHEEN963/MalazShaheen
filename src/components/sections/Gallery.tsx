"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { SiteContent } from "@/lib/content/types";
import { useIsCoarseOrSmall, useReducedMotion } from "@/lib/useReducedMotion";
import { RoomTag } from "../RoomTag";

/**
 * Room 03 — المعرض.
 * The works hang on a rotating cylinder in real perspective space. Drag it,
 * wheel it, or arrow through it; the piece facing you lifts toward the light.
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
  const radius = isSmall ? 260 : 430;
  // Derived from the live list, so adding or removing a work re-spaces the drum.
  const STEP = works.length > 0 ? 360 / works.length : 360;

  const [rotation, setRotation] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [openId, setOpenId] = useState<string | null>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const dragState = useRef({ startX: 0, startRotation: 0 });
  const idleRef = useRef(true);

  const activeIndex =
    ((Math.round(-rotation / STEP) % works.length) + works.length) % works.length;
  const activeWork = works.find((w) => w.id === openId) ?? null;

  // Slow drift while nobody is touching it — the cylinder feels alive.
  useEffect(() => {
    if (reducedMotion || openId) return;
    let raf = 0;
    let last = performance.now();
    const loop = (now: number) => {
      const dt = now - last;
      last = now;
      // Much gentler drift so the wall reads as still, not spinning.
      if (idleRef.current) setRotation((r) => r - dt * 0.0007);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [reducedMotion, openId]);

  useEffect(() => {
    if (!openId) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenId(null);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [openId]);

  function snap(to: number) {
    idleRef.current = false;
    setRotation(to);
  }

  function onPointerDown(event: React.PointerEvent) {
    idleRef.current = false;
    setDragging(true);
    dragState.current = { startX: event.clientX, startRotation: rotation };
    (event.target as HTMLElement).setPointerCapture?.(event.pointerId);
  }

  function onPointerMove(event: React.PointerEvent) {
    if (!dragging) return;
    const dx = event.clientX - dragState.current.startX;
    setRotation(dragState.current.startRotation - dx * 0.22);
  }

  function onPointerUp() {
    if (!dragging) return;
    setDragging(false);
    setRotation((r) => Math.round(r / STEP) * STEP);
  }

  return (
    <section
      id="works"
      className="relative z-10 overflow-hidden bg-[linear-gradient(180deg,rgba(42,42,39,0.94),rgba(35,35,33,0.88)_45%,rgba(42,42,39,0.94))] py-28 sm:py-36"
    >
      {/* stage spotlight */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-1/3 h-[520px] bg-[radial-gradient(ellipse_at_center,rgba(201,162,75,0.14),transparent_65%)]"
      />

      <div className="relative mx-auto max-w-6xl px-6">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <RoomTag index="٠٣" label={copy.label} />
            <h2 className="mt-6 font-display text-[clamp(2rem,5vw,3.4rem)] text-ink-ivory">
              {copy.heading}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => snap(rotation + STEP)}
              aria-label="العمل السابق"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-ink-gold/40 text-ink-gold transition-colors hover:bg-ink-gold hover:text-stone-900"
            >
              →
            </button>
            <span className="font-ui text-sm tabular-nums text-ink-sand">
              {activeIndex + 1} / {works.length}
            </span>
            <button
              type="button"
              onClick={() => snap(rotation - STEP)}
              aria-label="العمل التالي"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-ink-gold/40 text-ink-gold transition-colors hover:bg-ink-gold hover:text-stone-900"
            >
              ←
            </button>
          </div>
        </div>
      </div>

      {/* The cylinder */}
      <div
        className="relative mt-16 h-[440px] touch-pan-y select-none sm:h-[520px]"
        // Long perspective: cards keep almost the same size all the way round.
        style={{ perspective: "3200px" }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onMouseEnter={() => (idleRef.current = false)}
        onMouseLeave={() => {
          idleRef.current = true;
          onPointerUp();
        }}
      >
        <div
          ref={stageRef}
          className="absolute left-1/2 top-1/2 h-0 w-0"
          style={{
            transformStyle: "preserve-3d",
            transform: `translate(-50%,-50%) rotateY(${rotation}deg)`,
            transition: dragging ? "none" : "transform 0.9s cubic-bezier(0.22,1,0.36,1)",
          }}
        >
          {works.map((work, i) => {
            const cardAngle = i * STEP;
            const relative = ((cardAngle + rotation) % 360 + 360) % 360;
            const facing = Math.cos((relative * Math.PI) / 180);
            const isActive = i === activeIndex;
            return (
              <button
                key={work.id}
                type="button"
                onClick={() => (isActive ? setOpenId(work.id) : snap(-cardAngle))}
                aria-label={`${work.title} — ${work.category}`}
                className="absolute start-1/2 top-1/2 block h-[300px] w-[210px] sm:h-[360px] sm:w-[250px]"
                style={{
                  transform: `translate(-50%,-50%) rotateY(${cardAngle}deg) translateZ(${radius}px)`,
                  // Depth is signalled by light alone — no lift, blur or resize.
                  opacity: 0.32 + Math.max(0, facing) * 0.68,
                  pointerEvents: facing > 0.2 ? "auto" : "none",
                  transition: "opacity 0.6s ease",
                }}
              >
                <span
                  className={`relative flex h-full w-full flex-col justify-between overflow-hidden border p-5 text-start transition-colors duration-500 ${
                    isActive
                      ? "border-ink-gold/70 bg-stone-950 shadow-[0_40px_80px_-30px_rgba(0,0,0,0.9)]"
                      : "border-ink-gold/20 bg-stone-900"
                  }`}
                >
                  <span className="font-ui text-[0.7rem] tracking-wide text-ink-gold">
                    {work.category}
                  </span>
                  {work.image ? (
                    <>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={work.image}
                        alt=""
                        aria-hidden="true"
                        className="absolute inset-0 h-full w-full object-cover opacity-70"
                      />
                      <span
                        aria-hidden="true"
                        className="absolute inset-0 bg-[linear-gradient(to_top,rgba(28,28,26,0.92),rgba(28,28,26,0.25))]"
                      />
                    </>
                  ) : (
                    <span
                      aria-hidden="true"
                      className="absolute inset-0 flex items-center justify-center font-display text-[5rem] text-ink-ivory/[0.06]"
                    >
                      {work.title.slice(0, 1)}
                    </span>
                  )}
                  <span className="relative">
                    <span className="block font-display text-2xl leading-tight text-ink-ivory">
                      {work.title}
                    </span>
                    <span className="mt-2 block font-ui text-xs text-ink-sand/70">
                      {work.year}
                    </span>
                    {isActive && (
                      <span className="mt-3 block font-ui text-xs text-ink-gold">
                        {copy.cardHint}
                      </span>
                    )}
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        {/* floor shadow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-6 left-1/2 h-16 w-[70%] -translate-x-1/2 rounded-[50%] bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.55),transparent_70%)]"
        />
      </div>

      {/* Detail takeover — slides in from the reading edge */}
      <AnimatePresence>
        {activeWork && (
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
              className="absolute inset-y-0 end-0 flex w-full max-w-xl flex-col justify-center gap-6 bg-stone-900 px-10 py-16"
            >
              <button
                type="button"
                onClick={() => setOpenId(null)}
                aria-label="إغلاق"
                className="absolute start-8 top-8 font-ui text-sm text-ink-sand transition-colors hover:text-ink-gold"
              >
                إغلاق ✕
              </button>
              {activeWork.image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={activeWork.image}
                  alt={activeWork.title}
                  className="max-h-[38vh] w-full rounded-sm border border-ink-gold/25 object-cover"
                />
              )}
              <span className="font-ui text-xs tracking-wide text-ink-gold">
                {activeWork.category} · {activeWork.year}
              </span>
              <h3 className="font-display text-[clamp(2rem,6vw,3.5rem)] leading-tight text-ink-ivory">
                {activeWork.title}
              </h3>
              <div className="rule-gold" />
              <p className="font-editorial text-lg leading-[1.9] text-ink-sand">
                {activeWork.description}
              </p>
              <a href="#contact" className="btn btn-ghost mt-4 self-start">
                {copy.detailCta}
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
