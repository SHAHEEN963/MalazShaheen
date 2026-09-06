"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

const GLYPHS = ["ا", "ب", "ح", "د", "ر", "س", "ع", "ك", "ل", "م", "ن", "ه", "و", "ي", "ط", "ق", "ص", "خ"];

/** Deterministic pseudo-random so server and client agree and renders stay pure. */
function hash(seed: number) {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

/** Rasterises each glyph into a transparent canvas texture once fonts are ready. */
function useGlyphTextures() {
  const [textures, setTextures] = useState<THREE.CanvasTexture[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    const build = () => {
      if (cancelled) return;
      const made = GLYPHS.map((glyph) => {
        const size = 256;
        const canvas = document.createElement("canvas");
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.clearRect(0, 0, size, size);
          ctx.fillStyle = "#ffffff";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.font = `700 ${size * 0.66}px "Thmanyah Serif Display", "Thmanyah Sans", serif`;
          ctx.fillText(glyph, size / 2, size / 2);
        }
        const texture = new THREE.CanvasTexture(canvas);
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.needsUpdate = true;
        return texture;
      });
      setTextures(made);
    };

    if (document.fonts?.ready) {
      document.fonts.ready.then(build).catch(build);
    } else {
      build();
    }
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    return () => {
      textures?.forEach((t) => t.dispose());
    };
  }, [textures]);

  return textures;
}

type Glyph = {
  id: number;
  textureIndex: number;
  position: [number, number, number];
  scale: number;
  spin: number;
  tilt: number;
  gold: boolean;
  opacity: number;
};

function buildGlyphs(count: number): Glyph[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    textureIndex: Math.floor(hash(i * 3.7) * GLYPHS.length),
    position: [
      (hash(i * 5.1 + 1) - 0.5) * 26,
      (hash(i * 7.3 + 2) - 0.5) * 18,
      -hash(i * 2.2 + 3) * 60 - 2,
    ],
    scale: 0.7 + hash(i * 2.9 + 4) * 2.6,
    spin: (hash(i * 4.4 + 5) - 0.5) * 0.22,
    tilt: (hash(i * 6.6 + 6) - 0.5) * 1.2,
    gold: hash(i * 8.1 + 7) > 0.45,
    // Kept low so the field reads as atmosphere behind the type, not clutter.
    opacity: 0.09 + hash(i * 9.3 + 8) * 0.3,
  }));
}

function GlyphPlane({
  glyph,
  texture,
}: {
  glyph: Glyph;
  texture: THREE.CanvasTexture;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const t = state.clock.elapsedTime;
    mesh.rotation.z = glyph.tilt + Math.sin(t * 0.18 + glyph.id) * 0.12;
    mesh.rotation.y = Math.sin(t * 0.13 + glyph.id * 0.7) * 0.5;
    mesh.position.y = glyph.position[1] + Math.sin(t * 0.22 + glyph.id) * 0.35;
  });

  return (
    <mesh ref={meshRef} position={glyph.position} scale={glyph.scale}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial
        map={texture}
        transparent
        opacity={glyph.opacity}
        color={glyph.gold ? "#c9a24b" : "#f0ece2"}
        depthWrite={false}
        side={THREE.DoubleSide}
        toneMapped={false}
      />
    </mesh>
  );
}

/** Flies the glyph cloud toward the viewer in step with page scroll. */
function ScrollRig({
  progressRef,
  pointerRef,
}: {
  progressRef: React.MutableRefObject<number>;
  pointerRef: React.MutableRefObject<[number, number]>;
  }) {
  const groupRef = useRef<THREE.Group>(null);
  const glyphs = useMemo(() => buildGlyphs(46), []);
  const textures = useGlyphTextures();
  const { viewport } = useThree();

  useFrame(() => {
    const group = groupRef.current;
    if (!group) return;
    // Travel 58 units of depth across the whole page: a genuine fly-through.
    const targetZ = progressRef.current * 58;
    group.position.z += (targetZ - group.position.z) * 0.06;

    const [px, py] = pointerRef.current;
    group.position.x += (px * -1.6 - group.position.x) * 0.04;
    group.position.y += (py * 1.1 - group.position.y) * 0.04;
    group.rotation.y += (px * 0.06 - group.rotation.y) * 0.04;
    group.rotation.x += (py * -0.04 - group.rotation.x) * 0.04;
  });

  void viewport;
  if (!textures) return null;

  return (
    <group ref={groupRef}>
      {glyphs.map((glyph) => (
        <GlyphPlane
          key={glyph.id}
          glyph={glyph}
          texture={textures[glyph.textureIndex]}
        />
      ))}
    </group>
  );
}

function PointerTracker({
  pointerRef,
}: {
  pointerRef: React.MutableRefObject<[number, number]>;
}) {
  useFrame(({ pointer }) => {
    pointerRef.current = [pointer.x, pointer.y];
  });
  return null;
}

export default function LetterField() {
  const progressRef = useRef(0);
  const pointerRef = useRef<[number, number]>([0, 0]);

  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      progressRef.current = max > 0 ? doc.scrollTop / max : 0;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <Canvas
      camera={{ position: [0, 0, 8], fov: 55 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
    >
      <fog attach="fog" args={["#33332f", 14, 52]} />
      <PointerTracker pointerRef={pointerRef} />
      <ScrollRig progressRef={progressRef} pointerRef={pointerRef} />
    </Canvas>
  );
}
