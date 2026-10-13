"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Plays a video with its dark backdrop keyed out, cropped to the artwork.
 *
 * The hero clip is gold calligraphy on a near-black ground, and MP4 has no
 * alpha channel, so the ground showed as a box a shade off the page. Each
 * frame is drawn through a small WebGL shader that turns dark pixels
 * transparent by brightness — soft glows fade out instead of being cut — so
 * only the animation sits on the page.
 *
 * The artwork's bounds are measured from the clip itself (a few frames are
 * sampled before playback), so the empty margins are cropped away and any
 * replacement video uploaded from the dashboard is framed correctly too.
 * If WebGL or the measurement is unavailable it falls back to the plain video.
 */

type Crop = { x: number; y: number; w: number; h: number; ground: number };

const VERT = `
attribute vec2 p;
varying vec2 uv;
uniform vec4 crop;
void main() {
  vec2 t = p * 0.5 + 0.5;
  uv = vec2(crop.x + t.x * crop.z, crop.y + (1.0 - t.y) * crop.w);
  gl_Position = vec4(p, 0.0, 1.0);
}`;

const FRAG = `
precision mediump float;
varying vec2 uv;
uniform sampler2D tex;
uniform vec2 key;
void main() {
  vec3 c = texture2D(tex, uv).rgb;
  float m = max(c.r, max(c.g, c.b));
  float a = smoothstep(key.x, key.y, m);
  gl_FragColor = vec4(c * a, a);
}`;

/** Samples several frames on a small canvas and returns the lit area. */
async function measure(video: HTMLVideoElement): Promise<Crop | null> {
  const W = 256;
  const H = Math.max(1, Math.round((W * video.videoHeight) / video.videoWidth));
  const c = document.createElement("canvas");
  c.width = W;
  c.height = H;
  const ctx = c.getContext("2d", { willReadFrequently: true });
  if (!ctx) return null;

  const seek = (t: number) =>
    new Promise<void>((res) => {
      video.addEventListener("seeked", () => res(), { once: true });
      video.currentTime = t;
    });

  let ground = 0;
  const frames: Uint8ClampedArray[] = [];
  for (const f of [0.35, 0.55, 0.75, 0.92]) {
    await seek(video.duration * f);
    ctx.drawImage(video, 0, 0, W, H);
    const d = ctx.getImageData(0, 0, W, H).data;
    frames.push(d);
    // The ground is whatever the corners are.
    for (const [x, y] of [[1, 1], [W - 2, 1], [1, H - 2], [W - 2, H - 2]]) {
      const i = (y * W + x) * 4;
      ground = Math.max(ground, d[i], d[i + 1], d[i + 2]);
    }
  }

  const threshold = ground + 28;
  let x0 = W, y0 = H, x1 = -1, y1 = -1;
  for (const d of frames) {
    for (let y = 0; y < H; y++) {
      for (let x = 0; x < W; x++) {
        const i = (y * W + x) * 4;
        if (Math.max(d[i], d[i + 1], d[i + 2]) > threshold) {
          if (x < x0) x0 = x;
          if (x > x1) x1 = x;
          if (y < y0) y0 = y;
          if (y > y1) y1 = y;
        }
      }
    }
  }
  if (x1 < 0) return null;

  // A little breathing room so glows are not clipped at the edge.
  const padX = (x1 - x0) * 0.05;
  const padY = (y1 - y0) * 0.1;
  const left = Math.max(0, x0 - padX) / W;
  const top = Math.max(0, y0 - padY) / H;
  const right = Math.min(W, x1 + padX) / W;
  const bottom = Math.min(H, y1 + padY) / H;

  await seek(0);
  return { x: left, y: top, w: right - left, h: bottom - top, ground: ground / 255 };
}

export function KeyedVideo({ src, className }: { src: string; className?: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [aspect, setAspect] = useState<number | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;
    let raf = 0;
    let cancelled = false;

    const start = async () => {
      try {
        const crop = await measure(video);
        if (cancelled) return;
        if (!crop) throw new Error("nothing to crop");

        const gl = canvas.getContext("webgl", { premultipliedAlpha: true, alpha: true });
        if (!gl) throw new Error("no webgl");

        const shader = (type: number, code: string) => {
          const s = gl.createShader(type)!;
          gl.shaderSource(s, code);
          gl.compileShader(s);
          return s;
        };
        const prog = gl.createProgram()!;
        gl.attachShader(prog, shader(gl.VERTEX_SHADER, VERT));
        gl.attachShader(prog, shader(gl.FRAGMENT_SHADER, FRAG));
        gl.linkProgram(prog);
        gl.useProgram(prog);

        const buf = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buf);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
        const loc = gl.getAttribLocation(prog, "p");
        gl.enableVertexAttribArray(loc);
        gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

        gl.uniform4f(gl.getUniformLocation(prog, "crop"), crop.x, crop.y, crop.w, crop.h);
        gl.uniform2f(gl.getUniformLocation(prog, "key"), crop.ground + 0.03, crop.ground + 0.24);

        const tex = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, tex);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

        const ratio = (crop.w * video.videoWidth) / (crop.h * video.videoHeight);
        setAspect(ratio);

        let retrying = false;
        const draw = () => {
          const rect = canvas.getBoundingClientRect();
          const dpr = Math.min(window.devicePixelRatio || 1, 2);
          const w = Math.max(1, Math.round(rect.width * dpr));
          const h = Math.max(1, Math.round(rect.height * dpr));
          if (canvas.width !== w || canvas.height !== h) {
            canvas.width = w;
            canvas.height = h;
            gl.viewport(0, 0, w, h);
          }
          // A play() issued while the tab was hidden can be refused; retry
          // once the page is visible again.
          if (video.paused && !document.hidden && !retrying) {
            retrying = true;
            video.play().catch(() => {}).finally(() => (retrying = false));
          }
          if (video.readyState >= 2) {
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, video);
            gl.clearColor(0, 0, 0, 0);
            gl.clear(gl.COLOR_BUFFER_BIT);
            gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
          }
          raf = requestAnimationFrame(draw);
        };

        await video.play().catch(() => {});
        raf = requestAnimationFrame(draw);
      } catch {
        if (!cancelled) setFailed(true);
      }
    };

    if (video.readyState >= 1) start();
    else video.addEventListener("loadedmetadata", start, { once: true });

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      video.removeEventListener("loadedmetadata", start);
    };
  }, [src]);

  return (
    <>
      {/* Muted + playsInline is what lets mobile browsers autoplay. */}
      <video
        ref={videoRef}
        src={src}
        muted
        loop
        playsInline
        preload="auto"
        crossOrigin="anonymous"
        aria-hidden="true"
        className={failed ? className : "pointer-events-none absolute h-px w-px opacity-0"}
        autoPlay={failed}
      />
      {!failed && (
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          className={className}
          style={{
            aspectRatio: aspect ?? 16 / 9,
            // Hidden until measured, so the full frame never flashes.
            opacity: aspect ? 1 : 0,
            transition: "opacity 0.6s ease",
          }}
        />
      )}
    </>
  );
}
