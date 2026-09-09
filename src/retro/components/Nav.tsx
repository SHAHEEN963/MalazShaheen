"use client";

import { useEffect, useState } from "react";
import { nav, site, type SectionId } from "@/retro/data";

export function Nav() {
  const [active, setActive] = useState<SectionId>("home");
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  // Scroll spy. Offsets are cached and only recomputed on resize, so the
  // scroll handler itself is pure arithmetic — no layout reads per event.
  useEffect(() => {
    const ids = nav.map((n) => n.id);
    let offsets: { id: SectionId; top: number }[] = [];

    const measure = () => {
      offsets = ids
        .map((id) => ({ id, el: document.getElementById(id) }))
        .filter((s): s is { id: SectionId; el: HTMLElement } => Boolean(s.el))
        .map(({ id, el }) => ({ id, top: el.offsetTop }));
    };

    const update = () => {
      const y = window.scrollY;
      setScrolled(y > 24);

      // A section claims the nav once it crosses a line a third down the page.
      const line = y + window.innerHeight * 0.34;
      let current = offsets[0]?.id ?? "home";
      for (const s of offsets) {
        if (s.top <= line) current = s.id;
      }

      // At the very bottom the last section wins, however short it is.
      const atEnd =
        y + window.innerHeight >= document.documentElement.scrollHeight - 2;
      if (atEnd && offsets.length) current = offsets[offsets.length - 1].id;

      setActive(current);
    };

    const onResize = () => {
      measure();
      update();
    };

    measure();
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-100 transition-colors duration-300 ${
        scrolled
          ? "bg-void/92 border-b border-violet/40 backdrop-blur-sm"
          : "border-b border-transparent"
      }`}
    >
      <div className="wrap flex h-20 items-center justify-between gap-4">
        <a
          href="#home"
          className="group flex items-center gap-3"
          aria-label={`${site.brand} — back to top`}
        >
          <span
            aria-hidden="true"
            className="grid h-9 w-9 place-items-center border-2 border-pink text-pink shadow-[3px_3px_0_var(--color-violet)]"
          >
            <span className="title text-sm leading-none">NH</span>
          </span>
          <span className="title neon-pink hidden text-lg sm:block">
            {site.brand}
          </span>
        </a>

        {/* desktop links */}
        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {nav.map(({ id, label }) => {
              const isActive = active === id;
              return (
                <li key={id}>
                  <a
                    href={`#${id}`}
                    aria-current={isActive ? "true" : undefined}
                    className={`title relative block px-4 py-2 text-xs transition-colors ${
                      isActive ? "text-cyan" : "text-dim hover:text-ink"
                    }`}
                  >
                    {label}
                    <span
                      aria-hidden="true"
                      className={`absolute inset-x-3 bottom-1 h-0.5 transition-transform duration-200 ${
                        isActive
                          ? "scale-x-100 bg-cyan shadow-[0_0_10px_var(--color-cyan)]"
                          : "scale-x-0 bg-cyan"
                      }`}
                    />
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        <a href="#services" className="btn btn-cyan hidden xl:inline-flex">
          Hire us
        </a>

        {/* mobile toggle */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="retro-mobile-nav"
          className="title flex items-center gap-2 border-2 border-cyan px-3 py-2 text-xs text-cyan lg:hidden"
        >
          {open ? "CLOSE" : "MENU"}
        </button>
      </div>

      {/* mobile panel */}
      <nav
        id="retro-mobile-nav"
        aria-label="Primary mobile"
        hidden={!open}
        className="border-t border-violet/40 bg-void/97 backdrop-blur-sm lg:hidden"
      >
        <ul className="wrap flex flex-col py-3">
          {nav.map(({ id, label }) => (
            <li key={id}>
              <a
                href={`#${id}`}
                onClick={() => setOpen(false)}
                aria-current={active === id ? "true" : undefined}
                className={`title block border-b border-violet/20 py-3 text-sm ${
                  active === id ? "text-cyan" : "text-dim"
                }`}
              >
                <span className="text-violet">▸ </span>
                {label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
