"use client";

import { useState } from "react";
import type { SiteContent } from "@/lib/content/types";
import { useIsCoarseOrSmall } from "@/lib/useReducedMotion";
import { RoomTag } from "../RoomTag";

const NUMERALS = ["٠١", "٠٢", "٠٣", "٠٤", "٠٥", "٠٦"];

/**
 * Room 05 — الخدمات.
 * Not cards: a list of oversized type rows. Hovering a row lifts it, sweeps a
 * gold rule across it — nothing follows the pointer around.
 */
export function Offerings({
  services,
  copy,
}: {
  services: SiteContent["services"];
  copy: SiteContent["sections"]["services"];
}) {
  const [active, setActive] = useState<number | null>(null);
  const isSmall = useIsCoarseOrSmall();


  return (
    <section id="services" className="relative z-10 bg-stone-800/88 py-28 sm:py-40">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <RoomTag index="٠٤" label={copy.label} />
          <p className="max-w-sm font-editorial text-sm leading-relaxed text-ink-sand/80">
            {copy.intro}
          </p>
        </div>

        <ul className="mt-16 border-t border-ink-ivory/10">
          {services.map((service, i) => (
            <li
              key={service.title}
              onMouseEnter={() => setActive(i)}
              onMouseLeave={() => setActive((v) => (v === i ? null : v))}
              className="group relative border-b border-ink-ivory/10"
            >
              <a
                href="#contact"
                className="relative flex flex-col gap-3 py-8 transition-transform duration-500 md:flex-row md:items-baseline md:gap-10 md:py-10"
                style={{
                  transform:
                    active === i && !isSmall ? "translateX(-18px)" : "translateX(0)",
                }}
              >
                {/* gold sweep on hover */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-px origin-right bg-ink-gold transition-transform duration-700 ease-out"
                  style={{
                    transform: active === i ? "scaleX(1)" : "scaleX(0)",
                  }}
                />
                <span className="font-ui text-xs text-ink-gold md:w-16">
                  {NUMERALS[i]}
                </span>
                <span
                  className="font-display text-[clamp(1.8rem,5vw,3.4rem)] leading-tight transition-colors duration-500 md:flex-1"
                  style={{ color: active === i ? "var(--color-ink-gold)" : undefined }}
                >
                  {service.title}
                </span>
                <span className="max-w-sm font-editorial text-sm leading-relaxed text-ink-sand/80 md:w-80">
                  {service.description}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>

    </section>
  );
}
