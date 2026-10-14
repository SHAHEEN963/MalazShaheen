"use client";

import { useEffect, useRef, useState } from "react";
import type { VideoCrop } from "@/lib/content/types";

/**
 * Plays a video with its dark backdrop keyed out, cropped to the artwork.
 *
 * The hero clip is gold calligraphy on a near-black ground, and MP4 has no
 * alpha channel, so the ground showed as a box a shade off the page. Each
 * frame is drawn through a small WebGL shader that turns dark pixels
 * transparent by brightness — soft glows fade out instead of being cut — so
 * only the animation sits on the page.
 *
 * The crop (the artwork's bounds and the ground level) is measured once, when
 * the video is chosen in the dashboard, and stored with it. With a stored crop
 * playback starts straight away; without one it is measured on a second,
 * throwaway element so the visible video is never held up by seeking.
 * If WebGL is missing it shows the plain video; if the browser refuses to
 * play at all (low-power mode) it shows the fallback image.
 */

type Bounds = Omit<VideoCrop, "src">;

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

const once = (target: EventTarget, type: string, ms: number) =>
  new Promise<void>((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(`${type} timed out`)), ms);
    target.addEventListener(
      type,
      () => {
        clearTimeout(timer);
        resolve();
      },
      { once: true }
    );
  });

/** Samples several frames on a small canvas and returns the lit area. */
async function measure(video: HTMLVideoElement): Promise<Bounds | null> {
  const W = 256;
  const H = Math.max(1, Math.round((W * video.videoHeight) / video.videoWidth));
  const c = document.createElement("canvas");
  c.width = W;
  c.height = H;
  const ctx = c.getContext("2d", { willReadFrequently: true });
  if (!ctx) return null;

  let ground = 0;
  const frames: Uint8ClampedArray[] = [];
  for (const f of [0.35, 0.55, 0.75, 0.92]) {
    const seeked = once(video, "seeked", 8000);
    video.currentTime = video.duration * f;
    await seeked;
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
  const r = (n: number) => Math.round(n * 10000) / 10000;
  return {
    x: r(left),
    y: r(top),
    w: r(right - left),
    h: r(bottom - top),
    ground: r(ground / 255),
    aspect: r(((right - left) * video.videoWidth) / ((bottom - top) * video.videoHeight)),
  };
}

/** Loads `src` on a detached element and measures it. Used by the dashboard too. */
export async function measureVideo(src: string): Promise<VideoCrop | null> {
  const video = document.createElement("video");
  video.muted = true;
  video.playsInline = true;
  video.preload = "auto";
  video.crossOrigin = "anonymous";
  const loaded = once(video, "loadeddata", 15000);
  video.src = src;
  video.load();
  try {
    await loaded;
    const bounds = await measure(video);
    return bounds && { src, ...bounds };
  } catch {
    return null;
  } finally {
    video.removeAttribute("src");
    video.load();
  }
}

export function KeyedVideo({
  src,
  crop,
  fallbackImage,
  alt = "",
  className,
}: {
  src: string;
  crop?: VideoCrop | null;
  fallbackImage?: string;
  alt?: string;
  className?: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stored = crop && crop.src === src ? crop : null;
  const [measured, setMeasured] = useState<VideoCrop | null>(null);
  const bounds = stored ?? (measured?.src === src ? measured : null);
  // "video": no WebGL, show it unkeyed. "image": it will not play at all.
  const [failed, setFailed] = useState<null | "video" | "image">(null);

  // Only when nothing was stored: measure on the side, never on the player.
  useEffect(() => {
    if (stored) return;
    let cancelled = false;
    measureVideo(src).then((m) => {
      if (cancelled) return;
      if (m) setMeasured(m);
      else setFailed(fallbackImage ? "image" : "video");
    });
    return () => {
      cancelled = true;
    };
  }, [src, stored, fallbackImage]);

  // Start playing at once — the canvas picks frames up whenever it is ready.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    let retrying = false;
    const tryPlay = () => {
      if (!video.paused || retrying || document.hidden) return;
      retrying = true;
      video
        .play()
        .catch((err: unknown) => {
          // Refused outright (e.g. iOS low-power mode): show the still.
          if (err instanceof DOMException && err.name === "NotAllowedError" && fallbackImage) {
            setFailed("image");
          }
        })
        .finally(() => (retrying = false));
    };
    tryPlay();
    // A play() issued while the tab was hidden can be refused; retry on return.
    document.addEventListener("visibilitychange", tryPlay);
    video.addEventListener("canplay", tryPlay);
    return () => {
      document.removeEventListener("visibilitychange", tryPlay);
      video.removeEventListener("canplay", tryPlay);
    };
  }, [src, fallbackImage]);

  const x = bounds?.x, y = bounds?.y, w = bounds?.w, h = bounds?.h, g = bounds?.ground;
  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || x === undefined || y === undefined || w === undefined || h === undefined || g === undefined) return;

    const gl = canvas.getContext("webgl", { premultipliedAlpha: true, alpha: true });
    if (!gl) {
       
      setFailed("video");
      return;
    }

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

    gl.uniform4f(gl.getUniformLocation(prog, "crop"), x, y, w, h);
    gl.uniform2f(gl.getUniformLocation(prog, "key"), g + 0.03, g + 0.24);

    const tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    let raf = 0;
    const draw = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const cw = Math.max(1, Math.round(rect.width * dpr));
      const ch = Math.max(1, Math.round(rect.height * dpr));
      if (canvas.width !== cw || canvas.height !== ch) {
        canvas.width = cw;
        canvas.height = ch;
        gl.viewport(0, 0, cw, ch);
      }
      if (video.readyState >= 2) {
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, video);
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      }
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [x, y, w, h, g]);

  if (failed === "image" && fallbackImage) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={fallbackImage} alt={alt} className={className} />;
  }

  return (
    <>
      {/* Muted + playsInline is what lets mobile browsers autoplay. */}
      <video
        ref={videoRef}
        src={src}
        muted
        loop
        playsInline
        autoPlay
        preload="auto"
        crossOrigin="anonymous"
        aria-hidden="true"
        className={failed ? className : "pointer-events-none absolute h-px w-px opacity-0"}
      />
      {!failed && (
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          className={className}
          style={{
            // Until a new clip is measured, roughly the shipped clip's shape.
            aspectRatio: bounds?.aspect ?? 3.1,
            // Hidden until the crop is known, so the full frame never flashes.
            opacity: bounds ? 1 : 0,
            transition: "opacity 0.4s ease",
          }}
        />
      )}
    </>
  );
}
