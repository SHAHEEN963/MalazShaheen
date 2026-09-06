"use client";

import { useEffect, useRef } from "react";
import { useIsCoarseOrSmall, useReducedMotion } from "@/lib/useReducedMotion";

/** How long a point of ink survives before it is gone completely (ms).
 *  Short, so the stroke stays tight to the pointer instead of tailing behind. */
const LIFETIME = 320;

/**
 * A gold stroke that follows the pointer and erases itself completely behind
 * it. The canvas is fully cleared every frame and only points younger than
 * LIFETIME are redrawn, so no residue is ever left on the background — once
 * the pointer has passed, the background is untouched again.
 */
export function InkTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isCoarse = useIsCoarseOrSmall();
  const reducedMotion = useReducedMotion();
  const disabled = isCoarse || reducedMotion;

  useEffect(() => {
    if (disabled) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let points: { x: number; y: number; t: number }[] = [];
    let raf = 0;
    let box = { width: 0, height: 0, left: 0, top: 0 };

    function sizeCanvas() {
      // Measure the canvas's own box, not window.innerWidth: innerWidth counts
      // the scrollbar, which would scale the drawing and slide the stroke away
      // from the pointer across the screen.
      const rect = canvas!.getBoundingClientRect();
      box = { width: rect.width, height: rect.height, left: rect.left, top: rect.top };
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas!.width = Math.round(rect.width * dpr);
      canvas!.height = Math.round(rect.height * dpr);
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    sizeCanvas();

    function onMove(event: PointerEvent) {
      // Convert to canvas-local coordinates so the ink sits exactly under the tip.
      points.push({
        x: event.clientX - box.left,
        y: event.clientY - box.top,
        t: performance.now(),
      });
    }

    function tick() {
      const now = performance.now();
      // Wipe the whole surface first: nothing from previous frames survives.
      ctx!.clearRect(0, 0, box.width, box.height);

      points = points.filter((p) => now - p.t < LIFETIME);

      for (let i = 1; i < points.length; i++) {
        const prev = points[i - 1];
        const point = points[i];
        // 1 at the pointer, 0 at the tail — the stroke thins and vanishes.
        const life = 1 - (now - point.t) / LIFETIME;
        if (life <= 0) continue;

        ctx!.beginPath();
        ctx!.moveTo(prev.x, prev.y);
        ctx!.lineTo(point.x, point.y);
        ctx!.strokeStyle = `rgba(201, 162, 75, ${(life * 0.75).toFixed(3)})`;
        ctx!.lineWidth = 0.8 + life * 3.2;
        ctx!.lineCap = "round";
        ctx!.lineJoin = "round";
        ctx!.stroke();
      }

      raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("resize", sizeCanvas);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("resize", sizeCanvas);
    };
  }, [disabled]);

  if (disabled) return null;

  return (
    <canvas
      ref={canvasRef}
      // h-full/w-full are required: <canvas> is a replaced element, so inset-0
      // alone leaves it at its intrinsic 300x150 and the ink lands nowhere near
      // the pointer.
      className="pointer-events-none fixed inset-0 z-[90] h-full w-full"
      aria-hidden="true"
    />
  );
}
