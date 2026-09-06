"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { process as steps } from "@/lib/data";
import { RoomTag } from "../RoomTag";

/**
 * Room 06 — الرحلة.
 * The four stages are stacked in depth, not laid side by side. Scrolling pulls
 * the viewer forward through them: each stage rushes up out of the fog, holds,
 * then passes overhead.
 */
export function Journey() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  return (
    <section
      ref={sectionRef}
      id="process"
      className="relative z-10 bg-stone-900/92"
      style={{ height: `${steps.length * 100}vh` }}
    >
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <div className="pointer-events-none absolute inset-x-0 top-0 z-20 px-6 pt-20">
          <div className="mx-auto max-w-6xl">
            <RoomTag index="٠٥" label="الرحلة" />
          </div>
        </div>

        {/* depth fog */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_25%,var(--color-stone-950)_85%)]"
        />

        <div
          className="absolute inset-0 flex items-center justify-center px-6"
          style={{ perspective: "1100px", transformStyle: "preserve-3d" }}
        >
          {steps.map((step, i) => (
            <DepthCard
              key={step.step}
              step={step}
              index={i}
              total={steps.length}
              progress={scrollYProgress}
            />
          ))}
        </div>

        {/* progress ladder */}
        <div className="absolute bottom-10 left-1/2 z-20 flex -translate-x-1/2 gap-2">
          {steps.map((s, i) => (
            <Rung key={s.step} index={i} total={steps.length} progress={scrollYProgress} />
          ))}
        </div>
      </div>
    </section>
  );
}

function DepthCard({
  step,
  index,
  total,
  progress,
}: {
  step: (typeof steps)[number];
  index: number;
  total: number;
  progress: MotionValue<number>;
}) {
  // 0 → this card is front and centre; <0 → still ahead in the fog; >0 → passed.
  const local = useTransform(progress, (p) => p * (total - 0.2) - index);
  const z = useTransform(local, [-1, 0, 1], [-900, 0, 620]);
  const opacity = useTransform(local, [-1, -0.55, 0, 0.55, 1], [0, 1, 1, 1, 0]);
  const rotateX = useTransform(local, [-1, 0, 1], [16, 0, -18]);
  const blur = useTransform(local, [-1, -0.4, 0], ["blur(10px)", "blur(0px)", "blur(0px)"]);

  return (
    <motion.article
      style={{ z, opacity, rotateX, filter: blur }}
      className="absolute w-full max-w-xl border border-ink-gold/25 bg-stone-850/95 p-10 sm:p-14"
    >
      <span className="font-display text-outline-gold text-6xl leading-none">
        {step.step}
      </span>
      <h3 className="mt-6 font-display text-[clamp(1.8rem,5vw,3rem)] text-ink-ivory">
        {step.title}
      </h3>
      <div className="rule-gold my-6" />
      <p className="font-editorial text-base leading-[1.9] text-ink-sand">
        {step.description}
      </p>
    </motion.article>
  );
}

function Rung({
  index,
  total,
  progress,
}: {
  index: number;
  total: number;
  progress: MotionValue<number>;
}) {
  // Function transform (not a keyframe range) so no offset can fall outside 0–1.
  const opacity = useTransform(progress, (p) => {
    const local = p * (total - 0.2) - index;
    return 0.2 + 0.8 * Math.max(0, 1 - Math.abs(local));
  });
  return (
    <motion.span style={{ opacity }} className="block h-1 w-10 rounded-full bg-ink-gold" />
  );
}
