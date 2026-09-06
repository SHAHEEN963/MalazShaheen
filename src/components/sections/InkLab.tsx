"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { artist } from "@/lib/data";
import { RoomTag } from "../RoomTag";

/**
 * Room 07 — الحبر.
 * A framed sheet of paper. Ink only appears while the pointer is pressed, so
 * simply moving across the room leaves nothing behind; what you do write stays
 * until you clear it, and can be saved as a PNG.
 */
export function InkLab() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hasDrawn, setHasDrawn] = useState(false);
  const clearRef = useRef<() => void>(() => {});

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let last: { x: number; y: number; t: number } | null = null;
    let drawing = false;

    function resize() {
      const rect = canvas!.getBoundingClientRect();
      const snapshot =
        canvas!.width > 0 ? ctx!.getImageData(0, 0, canvas!.width, canvas!.height) : null;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas!.width = Math.round(rect.width * dpr);
      canvas!.height = Math.round(rect.height * dpr);
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (snapshot) ctx!.putImageData(snapshot, 0, 0);
    }

    function stroke(x: number, y: number) {
      const now = performance.now();
      if (last) {
        const dt = Math.max(now - last.t, 1);
        const dist = Math.hypot(x - last.x, y - last.y);
        const speed = dist / dt;
        // A real nib: slow, deliberate movement lays down more ink.
        const width = Math.max(1.4, 9 - speed * 5);

        ctx!.beginPath();
        ctx!.moveTo(last.x, last.y);
        ctx!.lineTo(x, y);
        ctx!.strokeStyle = "rgba(201, 162, 75, 0.95)";
        ctx!.lineWidth = width;
        ctx!.lineCap = "round";
        ctx!.lineJoin = "round";
        ctx!.stroke();

        if (speed < 0.35) {
          ctx!.beginPath();
          ctx!.arc(x, y, width * 0.7, 0, Math.PI * 2);
          ctx!.fillStyle = "rgba(232, 210, 154, 0.35)";
          ctx!.fill();
        }
      }
      last = { x, y, t: now };
    }

    function toLocal(clientX: number, clientY: number) {
      const rect = canvas!.getBoundingClientRect();
      return { x: clientX - rect.left, y: clientY - rect.top };
    }

    function onDown(e: PointerEvent) {
      drawing = true;
      last = null;
      const { x, y } = toLocal(e.clientX, e.clientY);
      stroke(x, y);
      setHasDrawn(true);
      canvas!.setPointerCapture?.(e.pointerId);
    }
    // Nothing is drawn unless the pointer is held down — no ghost trail.
    function onMove(e: PointerEvent) {
      if (!drawing) return;
      const { x, y } = toLocal(e.clientX, e.clientY);
      stroke(x, y);
    }
    function stop() {
      drawing = false;
      last = null;
    }

    clearRef.current = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      setHasDrawn(false);
    };

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();

    canvas.addEventListener("pointerdown", onDown);
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerup", stop);
    canvas.addEventListener("pointercancel", stop);
    canvas.addEventListener("pointerleave", stop);

    return () => {
      ro.disconnect();
      canvas.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerup", stop);
      canvas.removeEventListener("pointercancel", stop);
      canvas.removeEventListener("pointerleave", stop);
    };
  }, []);

  const clear = useCallback(() => clearRef.current(), []);

  /** Flattens the transparent ink onto the paper colour and downloads a PNG. */
  const save = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const out = document.createElement("canvas");
    out.width = canvas.width;
    out.height = canvas.height;
    const octx = out.getContext("2d");
    if (!octx) return;
    octx.fillStyle = "#1c1c1a";
    octx.fillRect(0, 0, out.width, out.height);
    octx.drawImage(canvas, 0, 0);

    const link = document.createElement("a");
    link.download = `${artist.name} — الحبر.png`;
    link.href = out.toDataURL("image/png");
    link.click();
  }, []);

  return (
    <section
      id="showcase"
      className="relative z-10 overflow-hidden bg-stone-950 py-24 sm:py-32"
    >
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <RoomTag index="٠٧" label="الحبر" />
          <p className="max-w-sm font-editorial text-sm leading-relaxed text-ink-sand/80">
            الريشة في يدك الآن. حرّكها ببطء ليغزر الحبر، وبسرعة ليرقّ الخط — كما
            يفعل القلم الحقيقي على الورق.
          </p>
        </div>

        {/* Framed sheet */}
        <div className="relative mt-12 border border-ink-gold/45 bg-stone-950 p-2 shadow-[0_40px_90px_-40px_rgba(0,0,0,0.9)]">
          <div className="relative border border-ink-gold/20">
            <canvas
              ref={canvasRef}
              // pan-y, not none: a touch visitor must still be able to swipe past this room
              className="block h-[420px] w-full touch-pan-y sm:h-[520px]"
              role="img"
              aria-label="سطح كتابة: اضغط واسحب لترك أثر الحبر"
            />
            {!hasDrawn && (
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 flex items-center justify-center font-ui text-base font-bold text-ink-sand/45"
              >
                انقر للكتابة
              </span>
            )}
          </div>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-end gap-4">
          <button
            type="button"
            onClick={clear}
            disabled={!hasDrawn}
            className="btn btn-ghost disabled:opacity-40"
          >
            امسح الورقة
          </button>
          <button
            type="button"
            onClick={save}
            disabled={!hasDrawn}
            className="btn btn-solid disabled:opacity-40"
          >
            احفظ الصورة
          </button>
        </div>
      </div>
    </section>
  );
}
