"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { artist } from "@/lib/data";

const links = [
  { href: "#about", label: "المرسم" },
  { href: "#works", label: "المعرض" },
  { href: "#services", label: "الخدمات" },
  { href: "#process", label: "الرحلة" },
  { href: "#voices", label: "الأصوات" },
  { href: "#showcase", label: "الحبر" },
  { href: "#contact", label: "التواصل" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-[60] transition-all duration-500 ${
        scrolled
          ? "bg-stone-900/80 backdrop-blur-xl shadow-[0_1px_0_rgba(201,162,75,0.18)]"
          : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <a
          href="#hero"
          className="font-display text-xl font-black text-ink-gold transition-opacity hover:opacity-70"
        >
          {artist.name}
        </a>

        <ul className="hidden items-center gap-9 md:flex">
          {links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="group relative font-ui text-sm font-bold text-ink-sand transition-colors hover:text-ink-gold"
              >
                {link.label}
                <span className="absolute -bottom-1.5 start-0 h-px w-0 bg-ink-gold transition-all duration-400 group-hover:w-full" />
              </a>
            </li>
          ))}
        </ul>

        <button
          type="button"
          onClick={() => setMenuOpen((v) => !v)}
          aria-expanded={menuOpen}
          aria-label="فتح قائمة التنقل"
          className="flex h-9 w-9 flex-col items-center justify-center gap-1.5 md:hidden"
        >
          <span
            className={`h-px w-6 bg-ink-gold transition-transform duration-300 ${
              menuOpen ? "translate-y-[3.5px] rotate-45" : ""
            }`}
          />
          <span
            className={`h-px w-6 bg-ink-gold transition-opacity duration-300 ${
              menuOpen ? "opacity-0" : "opacity-100"
            }`}
          />
          <span
            className={`h-px w-6 bg-ink-gold transition-transform duration-300 ${
              menuOpen ? "-translate-y-[5px] -rotate-45" : ""
            }`}
          />
        </button>
      </nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.ul
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col gap-1 overflow-hidden bg-stone-900/95 px-6 pb-6 backdrop-blur-xl md:hidden"
          >
            {links.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="block border-b border-ink-ivory/8 py-3 font-ui text-base font-bold text-ink-sand"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </header>
  );
}
