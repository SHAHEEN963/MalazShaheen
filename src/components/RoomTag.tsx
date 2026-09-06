"use client";

import { motion } from "framer-motion";

/** Museum-style room marker: keeps the journey legible while each room differs. */
export function RoomTag({
  index,
  label,
  align = "start",
}: {
  index: string;
  label: string;
  align?: "start" | "center";
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-15%" }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className={`flex items-center gap-4 ${
        align === "center" ? "justify-center" : "justify-start"
      }`}
    >
      <span className="font-display text-outline-gold text-3xl font-black leading-none">
        {index}
      </span>
      <span className="h-px w-12 bg-ink-gold/40" />
      <span className="font-ui text-sm font-bold tracking-[0.15em] text-ink-sand">
        {label}
      </span>
    </motion.div>
  );
}
