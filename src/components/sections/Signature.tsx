"use client";

import { useRef, useState, type ReactNode } from "react";
import { motion } from "framer-motion";
import { artist, contact } from "@/lib/data";
import { useIsCoarseOrSmall } from "@/lib/useReducedMotion";
import { RoomTag } from "../RoomTag";

/**
 * Room 08 — التوقيع.
 * The closing room: a flourish that writes itself across the wall, and two
 * magnetic doors out — WhatsApp and email.
 */
export function Signature() {
  const whatsappHref = `https://wa.me/${contact.whatsapp.replace(/[^\d]/g, "")}`;

  return (
    <section
      id="contact"
      className="relative z-10 overflow-hidden bg-stone-950/92 py-28 sm:py-40"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[420px] bg-[radial-gradient(ellipse_at_bottom,rgba(201,162,75,0.16),transparent_70%)]"
      />

      <div className="relative mx-auto max-w-5xl px-6 text-center">
        <RoomTag index="٠٨" label="التوقيع" align="center" />

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15%" }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="mt-10 font-display text-[clamp(2.6rem,10vw,7rem)] leading-[1.05] text-ink-ivory"
        >
          لنكتب شيئًا
          <span className="text-gold-foil"> يبقى</span>
        </motion.h2>

        {/* flourish that draws itself */}
        <svg
          viewBox="0 0 600 90"
          className="mx-auto mt-6 h-20 w-full max-w-lg"
          fill="none"
          aria-hidden="true"
        >
          <motion.path
            d="M20 62 C 90 12, 150 78, 220 44 C 285 13, 330 74, 400 50 C 455 31, 505 62, 580 30"
            stroke="var(--color-ink-gold)"
            strokeWidth="2.2"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: 1 }}
            viewport={{ once: true, margin: "-20%" }}
            transition={{ duration: 2.2, ease: [0.22, 1, 0.36, 1] }}
          />
        </svg>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.4 }}
          className="mx-auto mt-6 max-w-lg font-editorial text-lg leading-relaxed text-ink-sand"
        >
          حدّثني عن المناسبة والكلمات والشعور الذي تريده أن يحمله العمل. أرد
          شخصيًا على كل رسالة.
        </motion.p>

        <div className="mt-14 flex flex-col items-center justify-center gap-5 sm:flex-row">
          <Magnetic>
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-solid"
            >
              واتساب — {contact.whatsappDisplay}
            </a>
          </Magnetic>
          <Magnetic>
            <a href={`mailto:${contact.email}`} className="btn btn-ghost">
              {contact.email}
            </a>
          </Magnetic>
        </div>

        <div className="mt-16 flex flex-wrap items-center justify-center gap-8">
          {contact.socials.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative font-ui text-sm font-bold text-ink-sand transition-colors hover:text-ink-gold"
            >
              {s.label}
              <span className="absolute -bottom-1 start-0 h-px w-0 bg-ink-gold transition-all duration-500 group-hover:w-full" />
            </a>
          ))}
        </div>

        <div className="rule-gold mt-20" />
        <div className="mt-8 flex flex-col items-center justify-between gap-3 sm:flex-row">
          <p className="font-display text-xl font-black text-ink-gold">
            {artist.name}
          </p>
          <p className="font-ui text-sm font-bold text-ink-sand/70">
            جميع الحقوق محفوظة © {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </section>
  );
}

/** Pulls its child gently toward the quill when the pointer comes near. */
function Magnetic({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const isSmall = useIsCoarseOrSmall();

  function onMove(event: React.MouseEvent) {
    if (isSmall) return;
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const x = event.clientX - (rect.left + rect.width / 2);
    const y = event.clientY - (rect.top + rect.height / 2);
    setOffset({ x: x * 0.28, y: y * 0.34 });
  }

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={() => setOffset({ x: 0, y: 0 })}
      style={{
        transform: `translate(${offset.x}px, ${offset.y}px)`,
        transition: "transform 0.45s cubic-bezier(0.22,1,0.36,1)",
      }}
    >
      {children}
    </div>
  );
}
