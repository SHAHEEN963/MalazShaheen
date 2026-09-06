"use client";

import dynamic from "next/dynamic";
import { useIsCoarseOrSmall, useReducedMotion } from "@/lib/useReducedMotion";

const LetterField = dynamic(() => import("./LetterField"), { ssr: false });

/**
 * One persistent WebGL stage behind the whole page. Scroll flies the camera
 * through a depth-field of Arabic letterforms, so every section is entered
 * from inside the same 3D world rather than sitting on a flat page.
 */
export function Backdrop() {
  const reducedMotion = useReducedMotion();
  const isSmall = useIsCoarseOrSmall();

  if (reducedMotion) return null;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-0"
      aria-hidden="true"
      style={{ opacity: isSmall ? 0.55 : 1 }}
    >
      <LetterField />
    </div>
  );
}
