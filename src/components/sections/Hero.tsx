"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import type { SiteContent } from "@/lib/content/types";
import { useIsCoarseOrSmall, useReducedMotion } from "@/lib/useReducedMotion";
import { KeyedVideo } from "../KeyedVideo";

/**
 * Room 01 — الاسم.
 * The name sits inside the 3D letter cloud: it is written on by an ink-bleed
 * mask, tilts with the pointer on a real perspective plane, and dissolves
 * backwards into the scene as you leave the room.
 */
export function Hero({
  artist,
  copy,
}: {
  artist: SiteContent["artist"];
  copy: SiteContent["sections"]["hero"];
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
  const isSmall = useIsCoarseOrSmall();
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const depth = useTransform(scrollYProgress, [0, 1], [0, -320]);
  const fade = useTransform(scrollYProgress, [0, 0.75], [1, 0]);
  const blur = useTransform(scrollYProgress, [0, 0.8], ["blur(0px)", "blur(14px)"]);

  useEffect(() => {
    if (reducedMotion || isSmall) return;
    const onMove = (event: PointerEvent) => {
      setTilt({
        x: (event.clientX / window.innerWidth - 0.5) * 2,
        y: (event.clientY / window.innerHeight - 0.5) * 2,
      });
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [reducedMotion, isSmall]);

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative flex min-h-[100svh] flex-col items-center justify-start px-6 pb-24"
      style={
        {
          perspective: "1400px",
          // 68px is the fixed header. --g sits above and below the eyebrow, so
          // it lands midway between header and video; --t does the same for
          // the tagline between video and buttons.
          "--g": "clamp(36px, 6.5vh, 72px)",
          "--t": "clamp(28px, 5vh, 56px)",
          paddingTop: "calc(68px + var(--g))",
        } as React.CSSProperties
      }
    >
      <motion.div
        style={{ z: depth, opacity: fade, filter: blur }}
        className="relative z-10 flex flex-col items-center text-center"
      >
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="mb-[var(--g)] flex items-center gap-4"
        >
          <span className="h-px w-10 bg-ink-gold/50" />
          <span className="font-ui text-sm text-ink-gold">{artist.title}</span>
          <span className="h-px w-10 bg-ink-gold/50" />
        </motion.div>

        <div
          style={{
            transform: `perspective(1200px) rotateX(${tilt.y * -7}deg) rotateY(${
              tilt.x * 9
            }deg)`,
            transition: "transform 0.35s cubic-bezier(0.22,1,0.36,1)",
            transformStyle: "preserve-3d",
          }}
        >
          <motion.h1
            initial={{ clipPath: "inset(0 100% 0 0)", opacity: 0 }}
            animate={{ clipPath: "inset(0 0% 0 0)", opacity: 1 }}
            transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1], delay: 0.5 }}
            /* leading + padding give the ن of شاهين room for its bowl below
               the baseline; a tight line-height was cropping it. */
            className={
              artist.heroVideo
                ? "block leading-none"
                : "font-display text-gold-foil pb-[0.22em] text-[clamp(3.4rem,14vw,11rem)] leading-[1.24] drop-shadow-[0_30px_60px_rgba(0,0,0,0.55)]"
            }
          >
            {artist.heroVideo ? (
              <>
                <KeyedVideo
                  src={artist.heroVideo}
                  className="mx-auto block w-[clamp(260px,54vw,820px)] h-auto"
                />
                <span className="sr-only">{artist.name}</span>
              </>
            ) : artist.logoHero ? (
              /* Width tracks the type it replaces: ~774px at a 1440 viewport. */
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={artist.logoHero}
                alt={artist.name}
                className="w-[clamp(260px,54vw,820px)] h-auto"
              />
            ) : (
              artist.name
            )}
          </motion.h1>
        </div>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.5 }}
          className="mt-[var(--t)] max-w-lg font-editorial text-lg leading-relaxed text-ink-sand"
        >
          {artist.tagline}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.8 }}
          className="mt-[var(--t)] flex flex-col gap-4 sm:flex-row"
        >
          <a href="#works" className="btn btn-solid">
            {copy.ctaPrimary}
          </a>
          <a href="#contact" className="btn btn-ghost">
            {copy.ctaSecondary}
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
}
