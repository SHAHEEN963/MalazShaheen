"use client";

import { useRef, useState, type ReactNode } from "react";
import { motion } from "framer-motion";
import type { SiteContent } from "@/lib/content/types";
import { useIsCoarseOrSmall } from "@/lib/useReducedMotion";
import { RoomTag } from "../RoomTag";

/**
 * Room 08 — التوقيع.
 * The closing room: a flourish that writes itself across the wall, and two
 * magnetic doors out — WhatsApp and email.
 */
export function Signature({
  artist,
  contact,
  copy,
}: {
  artist: SiteContent["artist"];
  contact: SiteContent["contact"];
  copy: SiteContent["sections"]["signature"];
}) {
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
        <RoomTag index="٠٨" label={copy.label} align="center" />

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15%" }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="mt-10 font-display text-[clamp(2.6rem,10vw,7rem)] leading-[1.05] text-ink-ivory"
        >
          {copy.heading}
          <span className="text-gold-foil">{copy.headingAccent}</span>
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
          {copy.intro}
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
              className="group relative inline-flex items-center gap-2 font-ui text-sm font-bold text-ink-sand transition-colors hover:text-ink-gold"
            >
              <SocialIcon href={s.href} />
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

/**
 * Brand glyph for a social link, picked from its address so a renamed label
 * ("لينكد إن", "LinkedIn") keeps the right icon. Unknown sites get none.
 */
function SocialIcon({ href }: { href: string }) {
  const common = {
    width: 18,
    height: 18,
    viewBox: "0 0 24 24",
    "aria-hidden": true,
    className: "shrink-0",
  } as const;

  if (/instagram\.com/i.test(href)) {
    return (
      <svg {...common} fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4.2" />
        <circle cx="17.4" cy="6.6" r="1.1" fill="currentColor" stroke="none" />
      </svg>
    );
  }
  if (/behance\.net/i.test(href)) {
    return (
      <svg {...common} fill="currentColor">
        <path d="M8.2 11.3c.9-.4 1.4-1.1 1.4-2.2C9.6 7 8.1 6 6.1 6H1v12h5.3c2.1 0 4-1 4-3.4 0-1.5-.8-2.6-2.1-3.3ZM3.4 8h2.3c.9 0 1.6.3 1.6 1.2 0 .9-.6 1.3-1.5 1.3H3.4V8Zm2.6 8H3.4v-3.2h2.7c1.1 0 1.8.4 1.8 1.6 0 1.2-.8 1.6-1.9 1.6ZM16.9 9.1c-2.7 0-4.5 2-4.5 4.6 0 2.7 1.7 4.6 4.5 4.6 2.1 0 3.4-.9 4.1-2.9h-2.2c-.2.7-1.1 1.1-1.8 1.1-1.3 0-2-.8-2-2.1h6.1c.1-2.8-1.4-5.3-4.2-5.3Zm-1.9 3.8c.1-1.1.8-1.8 1.9-1.8 1.1 0 1.7.7 1.8 1.8H15ZM14.5 6.8h4.8v1.4h-4.8z" />
      </svg>
    );
  }
  if (/linkedin\.com/i.test(href)) {
    return (
      <svg {...common} fill="currentColor">
        <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9.75h4v11H3v-11Zm6.5 0h3.8v1.5h.05c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.78 2.65 4.78 6.1v5.45h-4v-4.83c0-1.15-.02-2.63-1.6-2.63-1.6 0-1.85 1.25-1.85 2.55v4.91h-4v-11Z" />
      </svg>
    );
  }
  return null;
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
