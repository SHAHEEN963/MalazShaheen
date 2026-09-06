"use client";

import { useEffect, useState } from "react";
import { useIsCoarseOrSmall } from "@/lib/useReducedMotion";

const rooms = [
  { id: "hero", label: "الاسم", index: "٠١" },
  { id: "about", label: "المرسم", index: "٠٢" },
  { id: "works", label: "المعرض", index: "٠٣" },
  { id: "services", label: "الخدمات", index: "٠٤" },
  { id: "process", label: "الرحلة", index: "٠٥" },
  { id: "voices", label: "الأصوات", index: "٠٦" },
  { id: "showcase", label: "الحبر", index: "٠٧" },
  { id: "contact", label: "التوقيع", index: "٠٨" },
];

/** A room index down the edge of the studio: which room you are standing in. */
export function JourneyRail() {
  const isSmall = useIsCoarseOrSmall();
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isSmall) return;
    const onScroll = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      setProgress(max > 0 ? Math.min(1, Math.max(0, doc.scrollTop / max)) : 0);

      let current = 0;
      rooms.forEach((room, i) => {
        const el = document.getElementById(room.id);
        if (el && el.getBoundingClientRect().top <= window.innerHeight * 0.45) {
          current = i;
        }
      });
      setActive(current);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [isSmall]);

  if (isSmall) return null;

  return (
    <nav
      aria-label="غرف الموقع"
      className="fixed inset-y-0 start-8 z-[55] hidden flex-col justify-center lg:flex"
    >
      <div className="relative flex flex-col gap-7 py-6">
        <span
          aria-hidden="true"
          className="absolute inset-y-0 start-[3px] w-px bg-ink-ivory/12"
        />
        <span
          aria-hidden="true"
          className="absolute start-[3px] top-0 w-px bg-[linear-gradient(to_bottom,var(--color-ink-gold),var(--color-ink-gold-light))] transition-[height] duration-500 ease-out"
          style={{ height: `${progress * 100}%` }}
        />
        {rooms.map((room, i) => (
          <a
            key={room.id}
            href={`#${room.id}`}
            className="group relative flex items-center gap-4"
          >
            <span
              className={`block rounded-full transition-all duration-400 ${
                i === active
                  ? "h-[7px] w-[7px] bg-ink-gold shadow-[0_0_12px_2px_rgba(201,162,75,0.55)]"
                  : "h-[7px] w-[7px] bg-ink-ivory/25 group-hover:bg-ink-gold/70"
              }`}
              style={{ marginInlineStart: "0px" }}
            />
            <span
              className={`whitespace-nowrap font-ui text-[0.78rem] font-bold transition-all duration-400 ${
                i === active
                  ? "text-ink-gold opacity-100"
                  : "text-ink-sand opacity-0 group-hover:opacity-80"
              }`}
            >
              {room.index} — {room.label}
            </span>
          </a>
        ))}
      </div>
    </nav>
  );
}
