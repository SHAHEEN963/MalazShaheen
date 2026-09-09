"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import type { SiteContent } from "@/lib/content/types";
import { RoomTag } from "../RoomTag";

/**
 * Room 02 — المرسم.
 * Print-editorial counterpoint to the hero: a solid panel that wipes up over
 * the 3D scene, an asymmetric grid, hairline rules, and a portrait plinth that
 * turns in space as the room scrolls past.
 */
export function Studio({
  artist,
  stats,
  copy,
}: {
  artist: SiteContent["artist"];
  stats: SiteContent["stats"];
  copy: SiteContent["sections"]["studio"];
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const plinthRotate = useTransform(scrollYProgress, [0, 1], [14, -14]);
  const plinthY = useTransform(scrollYProgress, [0, 1], [60, -60]);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative z-10 overflow-hidden bg-stone-850/90 panel-edge"
    >
      {/* curtain wipe: the panel draws itself up over the 3D world */}
      <motion.div
        initial={{ scaleY: 0 }}
        whileInView={{ scaleY: 1 }}
        viewport={{ once: true, margin: "-20%" }}
        transition={{ duration: 1.1, ease: [0.85, 0, 0.15, 1] }}
        className="absolute inset-0 origin-bottom bg-stone-850/90"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-6xl px-6 py-28 sm:py-40">
        <RoomTag index="٠٢" label={copy.label} />

        <div className="mt-16 grid gap-14 md:grid-cols-12 md:gap-10">
          {/* Portrait plinth */}
          <motion.div
            style={{ rotate: plinthRotate, y: plinthY }}
            className="md:col-span-4"
          >
            <div className="relative aspect-[3/4] w-full max-w-xs overflow-hidden bg-stone-950">
              {artist.portrait ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={artist.portrait}
                  alt={artist.name}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="font-display text-gold-foil text-[7rem] leading-none">
                    {artist.name.slice(0, 1)}
                  </span>
                </div>
              )}
              <div className="absolute inset-4 border border-ink-gold/25" />
              <div className="absolute bottom-0 start-0 end-0 h-24 bg-[linear-gradient(to_top,rgba(28,28,26,0.9),transparent)]" />
            </div>
            <p className="mt-4 max-w-xs font-ui text-xs leading-relaxed text-ink-sand/70">
              {artist.location}
            </p>
          </motion.div>

          {/* Editorial column */}
          <div className="md:col-span-8">
            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-15%" }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="font-display text-[clamp(2rem,5vw,3.6rem)] leading-[1.15] text-ink-ivory"
            >
              {artist.philosophy}
            </motion.h2>

            <div className="rule-gold my-10" />

            <div className="grid gap-8 sm:grid-cols-2">
              {artist.bio.map((paragraph, i) => (
                <motion.p
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-10%" }}
                  transition={{ duration: 0.8, delay: i * 0.12 }}
                  className="font-editorial text-base leading-[1.9] text-ink-sand"
                >
                  {paragraph}
                </motion.p>
              ))}
            </div>

            <div className="mt-14 grid grid-cols-2 gap-8 sm:grid-cols-4">
              {stats.map((stat) => (
                <Stat key={stat.id} value={stat.value} label={stat.label} />
              ))}
            </div>

            <ul className="mt-14 flex flex-wrap gap-3">
              {artist.specialties.map((s, i) => (
                <motion.li
                  key={s}
                  initial={{ opacity: 0, scale: 0.94 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  className="rounded-full border border-ink-gold/25 px-4 py-2 font-ui text-xs text-ink-sand"
                >
                  {s}
                </motion.li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7 }}
    >
      <p className="font-display text-4xl text-ink-gold">{value}</p>
      <p className="mt-1 font-ui text-xs text-ink-sand/70">{label}</p>
    </motion.div>
  );
}
