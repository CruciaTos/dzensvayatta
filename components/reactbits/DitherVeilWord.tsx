/*
 * DitherVeilWord — adapted from React Bits' Dither Veil (https://reactbits.dev), github.com/DavidHDev/react-bits
 * Copyright (c) 2026 David Haz. MIT + Commons Clause licence: free to use in this
 * website; the component itself may not be sold or redistributed on its own.
 *
 * Changed for Svayatta: instead of a pointer revealing a photo, a timed
 * shockwave swaps between words. It keeps Dither Veil's 8×8 Bayer order, its
 * rim band (each cell passes through the rim colour on the way across), its
 * expanding front and its dithered intro. Text is drawn to canvases and
 * uploaded as textures; the shader runs in WebGL2 through ogl.
 */
"use client";

import { useEffect, useRef, useState } from "react";
import { Mesh, Program, Renderer, Texture, Triangle } from "ogl";

export interface VeilWord {
  text: string;
  /** CSS font-family list; `var(--font-x)` is resolved from the page. */
  family: string;
  weight?: number;
  /** In em. */
  letterSpacing?: number;
  lang?: string;
}

/** The word's box, carrying the first word's bitmap for the site intro's match cut. */
export type VeilWordElement = HTMLDivElement & { veilSource?: HTMLCanvasElement; veilSet?: VeilWordMetrics };

export interface DitherVeilWordProps {
  words: VeilWord[];
  inkColor?: string;
  inkOpacity?: number;
  rimColor?: string;
  /** Dither cell size, CSS px. */
  pixelSize?: number;
  /** Share of each cell's switch spent in the rim colour (0–0.95). */
  rim?: number;
  /** Width of the dithered band behind the front, as a share of the width. */
  band?: number;
  holdMs?: number;
  swapMs?: number;
  introMs?: number;
  className?: string;
  /** Svayatta: hold still (as if off screen), e.g. while something covers it. */
  paused?: boolean;
}

const vertex = `#version 300 es
in vec2 position;
in vec2 uv;
out vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const fragment = `#version 300 es
precision highp float;
precision highp int;

uniform sampler2D tFrom;
uniform sampler2D tTo;
uniform vec2 uResolution;
uniform float uCell;
uniform vec3 uInk;
uniform float uInkAlpha;
uniform vec3 uRimColor;
uniform float uRim;
uniform vec2 uOrigin;
uniform float uFront;
uniform float uBand;
uniform float uIntro;

in vec2 vUv;
out vec4 fragColor;

// Dither Veil's 8x8 Bayer threshold.
float bayer(vec2 cell) {
  ivec2 p = ivec2(mod(cell, 8.0));
  int v = p.x ^ p.y;
  int m = ((v & 1) << 5) | ((p.y & 1) << 4) | ((v & 2) << 2) | ((p.y & 2) << 1) | ((v & 4) >> 1) | ((p.y & 4) >> 2);
  return (float(m) + 0.5) / 64.0;
}

void main() {
  vec2 px = vec2(gl_FragCoord.x, uResolution.y - gl_FragCoord.y);
  vec2 cell = floor(px / uCell);
  vec2 center = (cell + 0.5) * uCell;
  vec2 cellUv = vec2(center.x / uResolution.x, 1.0 - center.y / uResolution.y);
  float order = bayer(cell);

  // How far the front has carried this cell through the band (0 = untouched, 1 = passed).
  float s = clamp((uFront - distance(center, uOrigin)) / uBand, 0.0, 1.0);
  // Inside the band the letters break into dither dots; outside they are clean.
  float veil = smoothstep(0.0, 0.3, s) * (1.0 - smoothstep(0.7, 1.0, s));

  float cFrom = texture(tFrom, cellUv).a;
  float cTo = texture(tTo, cellUv).a;
  float from = mix(texture(tFrom, vUv).a, step(order, cFrom), veil);
  float to = mix(texture(tTo, vUv).a, step(order, cTo), veil);

  // Dither Veil's ordered switch: rim colour first, then the new word.
  float low = order * (1.0 - uRim);
  float atRim = step(low, s) * step(0.001, uRim);
  float atTo = step(low + uRim, s);
  float ink = mix(mix(from, 0.0, atRim), to, atTo);
  float rim = atRim * (1.0 - atTo) * step(order, max(cFrom, cTo));

  // Dither Veil's intro: cells appear outward from the centre, in Bayer order.
  vec2 aspect = vec2(uResolution.x / uResolution.y, 1.0);
  float spread = length((cellUv - 0.5) * aspect) / length(aspect * 0.5);
  float appear = step(spread * 0.72 + bayer(cell + vec2(3.0, 5.0)) * 0.28, uIntro * 1.001);

  vec4 color = vec4(uInk, 1.0) * (ink * uInkAlpha);
  color = mix(color, vec4(uRimColor, 1.0), rim);
  fragColor = color * appear;
}
`;

const hexToRgb = (hex: string): [number, number, number] => {
  let h = hex.replace("#", "");
  if (h.length === 3) h = h.replace(/./g, (c) => c + c);
  const n = parseInt(h.slice(0, 6), 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
};

const resolveFamily = (family: string) =>
  family.replace(/var\((--[\w-]+)\)/g, (_, name: string) =>
    getComputedStyle(document.documentElement).getPropertyValue(name).trim() || "sans-serif"
  );

/** How a word was set on its canvas (canvas pixels), so the site intro can set letters the same way. */
export interface VeilWordMetrics {
  text: string;
  /** Canvas `font` and `letterSpacing` values the word was drawn with. */
  font: string;
  letterSpacing: string;
  /** Where the text starts (x) and its baseline (y). */
  x: number;
  y: number;
  /** Width of the ink. */
  inkW: number;
}

/**
 * Draws a word as large as fits, centred on its ink, white on transparent.
 * Returns how it was set, or null if there is no 2D context.
 */
function drawWord(canvas: HTMLCanvasElement, w: number, h: number, word: VeilWord): VeilWordMetrics | null {
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  ctx.clearRect(0, 0, w, h);
  const family = resolveFamily(word.family);
  const set = (size: number) => {
    ctx.font = `${word.weight ?? 700} ${size}px ${family}`;
    ctx.letterSpacing = `${(word.letterSpacing ?? 0) * size}px`;
    return ctx.measureText(word.text);
  };
  let m = set(h);
  const inkW = m.actualBoundingBoxLeft + m.actualBoundingBoxRight;
  const inkH = m.actualBoundingBoxAscent + m.actualBoundingBoxDescent;
  m = set(h * Math.min((w * 0.98) / inkW, (h * 0.92) / inkH));
  const x = (w - (m.actualBoundingBoxLeft + m.actualBoundingBoxRight)) / 2 + m.actualBoundingBoxLeft;
  const y = (h - (m.actualBoundingBoxAscent + m.actualBoundingBoxDescent)) / 2 + m.actualBoundingBoxAscent;
  ctx.fillStyle = "#fff";
  ctx.textBaseline = "alphabetic";
  ctx.fillText(word.text, x, y);
  return {
    text: word.text,
    font: ctx.font,
    letterSpacing: ctx.letterSpacing,
    x,
    y,
    inkW: m.actualBoundingBoxLeft + m.actualBoundingBoxRight,
  };
}

export default function DitherVeilWord({
  words,
  inkColor = "#ffffff",
  inkOpacity = 1,
  rimColor = "#6CB4F0",
  pixelSize = 3,
  rim = 0.22,
  band = 0.4,
  holdMs = 3200,
  swapMs = 1600,
  introMs = 1200,
  className = "",
  paused = false,
}: DitherVeilWordProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [fallback, setFallback] = useState(false);
  const pausedRef = useRef(paused);
  // Set by the effect below: re-checks whether it should be running.
  const syncRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    pausedRef.current = paused;
    syncRef.current?.();
  }, [paused]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || words.length === 0) return;

    let renderer: Renderer;
    try {
      renderer = new Renderer({ dpr: Math.min(window.devicePixelRatio || 1, 2), alpha: true, premultipliedAlpha: true, antialias: false });
    } catch {
      setFallback(true);
      return;
    }
    if (!renderer.isWebgl2) {
      setFallback(true);
      return;
    }
    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 0);
    const canvas = gl.canvas;
    canvas.style.display = "block";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    container.appendChild(canvas);

    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const sources = words.map(() => document.createElement("canvas"));
    const textures = words.map(
      () => new Texture(gl, { generateMipmaps: false, minFilter: gl.LINEAR, magFilter: gl.LINEAR })
    );

    const uniforms = {
      tFrom: { value: textures[0] },
      tTo: { value: textures[Math.min(1, textures.length - 1)] },
      uResolution: { value: [1, 1] },
      uCell: { value: 3 },
      uInk: { value: hexToRgb(inkColor) },
      uInkAlpha: { value: inkOpacity },
      uRimColor: { value: hexToRgb(rimColor) },
      uRim: { value: Math.min(Math.max(rim, 0), 0.95) },
      uOrigin: { value: [0, 0] },
      uFront: { value: 0 },
      uBand: { value: 1 },
      uIntro: { value: 0 },
    };
    // No blending: the shader writes final premultiplied colour over a cleared canvas.
    const program = new Program(gl, { vertex, fragment, uniforms, transparent: false, depthTest: false, depthWrite: false });
    const mesh = new Mesh(gl, { geometry: new Triangle(gl), program });

    let current = 0;
    let phase: "wait" | "intro" | "hold" | "swap" = "wait";
    let phaseStart = 0;
    let reach = 1;
    let raf = 0;
    let timer = 0;
    let visible = true;
    let started = false;

    const render = () => renderer.render({ scene: mesh });

    const layout = () => {
      const w = Math.max(1, container.clientWidth);
      const h = Math.max(1, container.clientHeight);
      renderer.setSize(w, h);
      uniforms.uResolution.value = [canvas.width, canvas.height];
      uniforms.uCell.value = Math.max(1, Math.round(pixelSize * renderer.dpr));
      uniforms.uBand.value = canvas.width * band;
      words.forEach((word, i) => {
        const set = drawWord(sources[i], canvas.width, canvas.height, word);
        // The site's intro match-cuts onto the first word (see IntroLoader): it flips
        // letters set the same way, then lands on this exact bitmap.
        if (i === 0 && set && set.inkW > 0) {
          container.dataset.inkWidth = String(set.inkW / renderer.dpr);
          container.dataset.inkOpacity = String(inkOpacity);
          const el = container as VeilWordElement;
          el.veilSource = sources[0];
          el.veilSet = set;
        }
        textures[i].image = sources[i];
        textures[i].needsUpdate = true;
      });
      render();
    };

    const clearTimers = () => {
      cancelAnimationFrame(raf);
      clearTimeout(timer);
      raf = 0;
      timer = 0;
    };

    const tick = (now: number) => {
      raf = 0;
      if (phase === "intro") {
        const k = Math.min(1, (now - phaseStart) / introMs);
        uniforms.uIntro.value = 1 - Math.pow(1 - k, 2);
        if (k >= 1) enterHold(now);
      } else if (phase === "swap") {
        const k = Math.min(1, (now - phaseStart) / swapMs);
        // Dither Veil's burst reach: fast out, easing into the far edge.
        uniforms.uFront.value = (reach + uniforms.uBand.value) * Math.sin((k * Math.PI) / 2);
        if (k >= 1) {
          current = (current + 1) % words.length;
          uniforms.tFrom.value = textures[current];
          uniforms.uFront.value = 0;
          enterHold(now);
        }
      }
      render();
      if (visible && (phase === "intro" || phase === "swap")) raf = requestAnimationFrame(tick);
    };

    const enterHold = (now: number) => {
      phase = "hold";
      phaseStart = now;
      if (still || words.length < 2) return;
      timer = window.setTimeout(startSwap, holdMs);
    };

    const startSwap = () => {
      timer = 0;
      if (!visible) return;
      const next = (current + 1) % words.length;
      uniforms.tFrom.value = textures[current];
      uniforms.tTo.value = textures[next];
      // A burst from a random point inside the word, reaching the farthest corner.
      const w = canvas.width;
      const h = canvas.height;
      const ox = w * (0.15 + Math.random() * 0.7);
      const oy = h * (0.3 + Math.random() * 0.4);
      uniforms.uOrigin.value = [ox, oy];
      reach = Math.hypot(Math.max(ox, w - ox), Math.max(oy, h - oy));
      uniforms.uFront.value = 0;
      phase = "swap";
      phaseStart = performance.now();
      raf = requestAnimationFrame(tick);
    };

    // `cut`: the site intro's wordmark has just landed on this exact word, so
    // show it whole in this frame (no dither-in) and carry on with the swaps.
    const begin = (cut = false) => {
      if (started) return;
      started = true;
      if (still || cut) {
        uniforms.uIntro.value = 1;
        render();
        phase = "hold";
        if (!still) enterHold(performance.now());
        return;
      }
      phase = "intro";
      phaseStart = performance.now();
      raf = requestAnimationFrame(tick);
    };

    // Pause off screen (or when paused); when it comes back, wait out a fresh
    // hold before the next swap.
    let onScreen = true;
    const sync = () => {
      const was = visible;
      visible = onScreen && !pausedRef.current;
      if (visible === was) return;
      if (!visible) {
        clearTimers();
        if (phase === "swap") {
          current = (current + 1) % words.length;
          uniforms.tFrom.value = textures[current];
          uniforms.uFront.value = 0;
          phase = "hold";
        }
        if (phase === "intro") {
          uniforms.uIntro.value = 1;
          phase = "hold";
        }
        render();
      } else if (started && phase === "hold") {
        enterHold(performance.now());
      }
    };
    const io = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
      sync();
    });
    io.observe(container);
    syncRef.current = sync;

    const ro = new ResizeObserver(layout);
    ro.observe(container);
    layout();

    // Start once the fonts are in. While the site's intro runs, stay blank
    // underneath it: its wordmark lands on this word and the intro ends in the
    // same frame ("done"), a match cut, so this word appears whole right then.
    let mo: MutationObserver | null = null;
    const html = document.documentElement;
    const whenIntroDone = () => {
      const state = html.dataset.intro;
      if (state === "run" || state === "move") {
        mo = new MutationObserver(() => {
          const next = html.dataset.intro;
          if (next === "run" || next === "move") return;
          mo?.disconnect();
          begin(true);
        });
        mo.observe(html, { attributes: true, attributeFilter: ["data-intro"] });
      } else {
        window.setTimeout(begin, 400);
      }
    };
    // A font used only on a canvas is never fetched on its own: load each word's face first.
    const faces = words.map((word) =>
      document.fonts?.load(`${word.weight ?? 700} 64px ${resolveFamily(word.family)}`, word.text).catch(() => [])
    );
    Promise.all([...faces, document.fonts?.ready]).then(() => {
      layout();
      whenIntroDone();
    });

    return () => {
      syncRef.current = null;
      clearTimers();
      io.disconnect();
      ro.disconnect();
      mo?.disconnect();
      gl.getExtension("WEBGL_lose_context")?.loseContext();
      canvas.parentNode?.removeChild(canvas);
    };
    // The words and look are fixed for the component's life.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div ref={containerRef} data-veil-word aria-hidden="true" className={`relative ${className}`.trim()}>
      {fallback && (
        <span
          lang={words[0]?.lang}
          className="absolute inset-0 flex items-center justify-center font-display text-[clamp(3rem,14vw,12rem)] font-extrabold leading-none"
          style={{ color: inkColor, opacity: inkOpacity }}
        >
          {words[0]?.text}
        </span>
      )}
    </div>
  );
}
