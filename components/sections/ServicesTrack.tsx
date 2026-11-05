"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { SERVICES, SERVICE_GROUPS } from "@/lib/services";
import type { Service } from "@/types/content";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { PillButton } from "@/components/ui/PillButton";
import { TextLink } from "@/components/ui/TextLink";
import { MaskReveal } from "@/components/motion/MaskReveal";
import FlexCarousel, { type FlexCarouselItem } from "@/components/reactbits/FlexCarousel";
import { em } from "@/lib/rich";
import { easeOutCubic, range } from "@/lib/motion";
import { edgeGone, edgeMask, manifestoEdge, manifestoHandoff, setMask, type WipeEdge } from "@/lib/handoff";

/**
 * Services (§H6) on React Bits' Flex Carousel: drag, flick or use the arrow
 * keys, and the cards bend through a liquid lens as they pass the edges. It
 * moves on by itself every few seconds when left alone. The centred card is
 * wider than the rest (at least 30% of the width), always clear (no bend),
 * and its extra width reveals what that service covers. Clicking it opens that service. Each card is a poster drawn in the browser (a
 * light surface with blue accents, index, title, tagline, summary); an "Open …" link under the
 * carousel follows the centred card, and screen readers get a plain list.
 */

const TITLE = "Services\n*we offer*";
const GROUP_LABEL =Object.fromEntries(SERVICE_GROUPS.map((g) => [g.id, g.label]));

// Card artwork: framed from its left edge. Side cards (3:4) show the left
// part, the text column (SAFE wide); the centred card is wider and also shows
// the right part, a list of what the service covers. The artwork's width is
// set to exactly what the centre card shows on this screen.
const H = 1280;
// Carousel settings the artwork has to match.
const CARD_HEIGHT = 0.63;
// The cards sit a little above the middle: the room under them is for their
// shadows (and the bend), and the gap under the heading stays tight.
const CENTER_Y = 0.466;
const CENTER_SCALE = 1.7;
const CENTER_MIN_WIDTH = 0.45;
// The card shader zooms the artwork 8%; side cards (3:4) show this much of it.
const ZOOM = 1.08;
const SAFE = 880;
const PAD = 64;
const PAD_Y = 96;
// The words stack up from the foot; they start higher than PAD_Y so the last
// line sits clear of the glass rim's strongest bend (the rim splits colour).
const PAD_B = 150;

const cssFont = (name: string) => getComputedStyle(document.documentElement).getPropertyValue(name).trim() || "sans-serif";

/** Breaks text into lines that fit `width` at the context's current font. */
function wrap(ctx: CanvasRenderingContext2D, text: string, width: number, maxLines = 4): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let line = "";
  for (const word of words) {
    const next = line ? `${line} ${word}` : word;
    if (ctx.measureText(next).width > width && line) {
      lines.push(line);
      line = word;
    } else {
      line = next;
    }
  }
  if (line) lines.push(line);
  if (lines.length > maxLines) {
    const kept = lines.slice(0, maxLines);
    kept[maxLines - 1] = `${kept[maxLines - 1].replace(/[\s,.;:]+\S*$/, "")}…`;
    return kept;
  }
  return lines;
}

/**
 * One service as a poster: a pale surface (not a blue fill) with soft cobalt
 * and sky glows, a faint blue index, and the words in ink with blue accents.
 */
function drawCard(service: Service, i: number, fonts: { display: string; serif: string; sans: string }, W: number): string {
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  if (!ctx) return "";

  // Light base, a touch deeper than the page's white so the card still reads as a card.
  const base = ctx.createLinearGradient(0, 0, W * 0.4, H);
  base.addColorStop(0, "#f7faff");
  base.addColorStop(0.55, "#eef4fc");
  base.addColorStop(1, "#e6eefb");
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, W, H);

  const glow = (x: number, y: number, r: number, rgb: string, a: number) => {
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, `rgba(${rgb},${a})`);
    g.addColorStop(1, `rgba(${rgb},0)`);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
  };
  // Blue lives in the light, not the fill. The glows swap sides from card to
  // card, so the row reads as one long poster.
  const flip = i % 2 === 1;
  glow(flip ? SAFE : 0, 0, SAFE * 0.95, "108,180,240", 0.32);
  glow(flip ? 0 : SAFE, H * 0.18, SAFE * 0.8, "30,91,214", 0.12);
  glow(SAFE * (flip ? 0.2 : 0.85), H * 0.7, SAFE * 0.6, "108,180,240", 0.18);
  glow(W * 0.85, H * 0.3, W * 0.45, "30,91,214", 0.08);

  ctx.textBaseline = "alphabetic";

  // Big faint index, in cobalt.
  ctx.font = `800 ${Math.round(H * 0.4)}px ${fonts.display}`;
  ctx.letterSpacing = "-24px";
  ctx.textAlign = "right";
  ctx.fillStyle = "rgba(30,91,214,0.09)";
  ctx.fillText(service.index, SAFE - 36, H * 0.44);
  ctx.textAlign = "left";

  // Top label and arrow.
  ctx.font = `600 30px ${fonts.sans}`;
  ctx.letterSpacing = "4px";
  ctx.fillStyle = "#1e5bd6";
  // Top label and arrow sit a little lower than PAD_Y, clear of the rim's bend.
  const TOP = PAD_Y + 26;
  ctx.fillText(`${service.index} / ${GROUP_LABEL[service.group].toUpperCase()}`, PAD, TOP + 30);
  ctx.fillStyle = "#1e5bd6";
  ctx.beginPath();
  ctx.arc(SAFE - PAD - 34, TOP + 20, 34, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 3;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(SAFE - PAD - 46, TOP + 32);
  ctx.lineTo(SAFE - PAD - 22, TOP + 8);
  ctx.moveTo(SAFE - PAD - 40, TOP + 8);
  ctx.lineTo(SAFE - PAD - 22, TOP + 8);
  ctx.lineTo(SAFE - PAD - 22, TOP + 26);
  ctx.stroke();

  // The words, stacked up from the foot: summary, tagline, title.
  const textW = SAFE - PAD * 2;
  let y = H - PAD_B;

  // Supporting line: readable, but quieter than the title and the list.
  ctx.font = `400 37px ${fonts.sans}`;
  ctx.letterSpacing = "0px";
  ctx.fillStyle = "#38486a";
  const summary = wrap(ctx, service.summary, textW, 3);
  for (let k = summary.length - 1; k >= 0; k--) {
    ctx.fillText(summary[k], PAD, y);
    y -= 52;
  }
  y -= 22;

  // Keywords people scan for (WhatsApp, voice, dashboards…).
  ctx.font = `italic 400 50px ${fonts.serif}`;
  ctx.fillStyle = "#1e5bd6";
  const tagline = wrap(ctx, service.tagline.join(" · "), textW, 2);
  for (let k = tagline.length - 1; k >= 0; k--) {
    ctx.fillText(tagline[k], PAD, y);
    y -= 60;
  }
  y -= 26;

  // The service name: the first thing anyone reads, so as big as it can go.
  // Starts large and steps down only until its longest word fits the column
  // and the whole name fits in three lines.
  ctx.fillStyle = "#0a1830";
  let size = 140;
  let title: string[] = [];
  for (; size >= 96; size -= 4) {
    ctx.font = `600 ${size}px ${fonts.display}`;
    ctx.letterSpacing = `${-Math.round(size / 36)}px`;
    const longest = Math.max(...service.title.split(/\s+/).map((w) => ctx.measureText(w).width));
    title = wrap(ctx, service.title, textW, 3);
    if (longest <= textW && wrap(ctx, service.title, textW, 99).length <= 3) break;
  }
  const lead = Math.round(size * 0.98);
  for (let k = title.length - 1; k >= 0; k--) {
    ctx.fillText(title[k], PAD, y);
    y -= lead;
  }

  // The right part, seen only on the wider centre card: what it covers.
  const colX = SAFE + 40;
  // The card is framed from its left edge and zoomed, so its right part is
  // cropped: keep the column inside what the centre card really shows.
  const colW = W / ZOOM - colX - PAD;
  if (colW < 220) return canvas.toDataURL("image/jpeg", 0.9);
  ctx.strokeStyle = "rgba(10,24,48,0.12)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(SAFE, PAD_Y);
  ctx.lineTo(SAFE, H - PAD_Y);
  ctx.stroke();
  // What it covers: the concrete answer to "do you do X?", so it is set
  // nearly as large as the summary's lead and wraps rather than cutting off.
  ctx.font = `500 42px ${fonts.sans}`;
  ctx.letterSpacing = "0px";
  const numW = 78;
  const lineH = 52;
  const rows = service.painPoints.map((point) => wrap(ctx, point, colW - numW, 2));
  let rowBottom = H - PAD_B;
  const placed: { lines: string[]; base: number }[] = [];
  for (let k = rows.length - 1; k >= 0; k--) {
    const lines = rows[k];
    placed[k] = { lines, base: rowBottom - (lines.length - 1) * lineH };
    rowBottom -= lines.length * lineH + 50;
  }
  placed.forEach(({ lines, base }, k) => {
    const top = base - 72;
    ctx.strokeStyle = "rgba(10,24,48,0.1)";
    ctx.beginPath();
    ctx.moveTo(colX, top);
    ctx.lineTo(colX + colW, top);
    ctx.stroke();
    ctx.font = `600 42px ${fonts.sans}`;
    ctx.fillStyle = "#1e5bd6";
    ctx.fillText(String(k + 1).padStart(2, "0"), colX, base - 14);
    ctx.font = `500 42px ${fonts.sans}`;
    ctx.fillStyle = "#0a1830";
    lines.forEach((line, j) => ctx.fillText(line, colX + numW, base - 14 + j * lineH));
  });
  ctx.font = `600 30px ${fonts.sans}`;
  ctx.letterSpacing = "4px";
  ctx.fillStyle = "#5d6c88";
  ctx.fillText("WHAT IT COVERS", colX, placed[0].base - 72 - 34);

  return canvas.toDataURL("image/jpeg", 0.9);
}

// The hand-off from "Who we are": each part fades in over this stretch of the
// manifesto's wipe (0–1), heading first, then the cards, then the link.
const HANDOFF: [number, number][] = [
  [0.15, 0.65],
  [0.4, 0.95],
  [0.5, 1],
];

/**
 * `handoff`: on the home page, the section has no entrance of its own. It
 * fades in on the same white as the manifesto's panel wipes away, so the two
 * read as one page (see lib/handoff.ts).
 */
export function ServicesTrack({ handoff = false }: { handoff?: boolean }) {
  const router = useRouter();
  const [items, setItems] = useState<FlexCarouselItem[] | null>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const headRef = useRef<HTMLDivElement>(null);
  const footRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!handoff) return;
    const paint = (v: number) => {
      [headRef.current, stageRef.current, footRef.current].forEach((el, i) => {
        if (!el) return;
        const t = easeOutCubic(range(v, ...HANDOFF[i]));
        el.style.opacity = String(t);
        // A short settle, not a rise: the white is already there.
        el.style.transform = t < 1 ? `translate3d(0, ${(1 - t) * 10}px, 0)` : "";
        if (i === 0) el.style.filter = t < 1 ? `blur(${(1 - t) * 6}px)` : "";
      });
    };
    // Only on the white side of the wipe's slanted, soft edge, so it arrives
    // with the white (blending in across the same band) and never sits on the
    // panel. The mask runs the same edge through this section's own box.
    const clip = (e: WipeEdge) => {
      const el = sectionRef.current;
      if (el) setMask(el, edgeGone(e) ? "" : edgeMask(e, el.getBoundingClientRect()));
    };
    paint(manifestoHandoff.get());
    clip(manifestoEdge.get());
    const offFade = manifestoHandoff.on("change", paint);
    const offClip = manifestoEdge.on("change", clip);
    return () => {
      offFade();
      offClip();
    };
  }, [handoff]);

  // Draw the cards once the brand fonts are in.
  useEffect(() => {
    let cancelled = false;
    const fonts = { display: cssFont("--font-display"), serif: cssFont("--font-serif"), sans: cssFont("--font-sans") };

    function generateCards() {
      // How wide the centre card is on this screen, as width ÷ height.
      const stage = stageRef.current;
      const cw = stage?.clientWidth || window.innerWidth;
      const ch = stage?.clientHeight || window.innerHeight * 0.86;
      const centreAspect = Math.max(0.75 * CENTER_SCALE, (CENTER_MIN_WIDTH * cw) / (CARD_HEIGHT * ch));
      // Exactly the centre card's shape: narrower and the card shader has to
      // crop it top and bottom (cutting the label and the summary); this way it
      // only loses the shader's 8% zoom, well inside the padding.
      const artW = Math.max(SAFE, Math.round(H * centreAspect));
      return SERVICES.map((s, i) => ({
        src: drawCard(s, i, fonts, artW),
        alt: `${s.title}: ${s.summary}`,
        title: s.title,
        subtitle: s.tagline.join(" · "),
      }));
    }

    Promise.all([
      document.fonts?.load(`600 140px ${fonts.display}`),
      document.fonts?.load(`800 86px ${fonts.display}`),
      document.fonts?.load(`italic 400 50px ${fonts.serif}`),
      document.fonts?.load(`400 37px ${fonts.sans}`),
      document.fonts?.load(`600 30px ${fonts.sans}`),
      document.fonts?.load(`500 42px ${fonts.sans}`),
    ])
      .catch(() => [])
      .then(() => {
        if (cancelled) return;
        setItems(generateCards());
      });

    // Redrawing six large posters is expensive, so only do it when the centre
    // card's shape really changes (not when a phone's address bar slides in
    // and out while scrolling, which also fires resize).
    const artWidth = () => {
      const stage = stageRef.current;
      const cw = stage?.clientWidth || window.innerWidth;
      const ch = stage?.clientHeight || window.innerHeight * 0.86;
      return Math.max(SAFE, Math.round(H * Math.max(0.75 * CENTER_SCALE, (CENTER_MIN_WIDTH * cw) / (CARD_HEIGHT * ch))));
    };
    let drawnWidth = artWidth();
    let resizeTimer: ReturnType<typeof setTimeout>;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        if (cancelled) return;
        const next = artWidth();
        if (Math.abs(next - drawnWidth) / drawnWidth < 0.04) return;
        drawnWidth = next;
        setItems(generateCards());
      }, 250);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelled = true;
      clearTimeout(resizeTimer);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      aria-labelledby="services-title"
      className={`section relative overflow-x-clip text-ink !pb-4 md:!pb-6 ${
        // On the hand-off it rides up over the manifesto's pinned stage: above it, and see-through.
        handoff ? "z-20" : "bg-paper"
      }`}
    >
      <div ref={headRef} className="relative z-10 flex flex-col gap-5 px-[clamp(16px,4vw,48px)] sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Eyebrow className="mb-5">What we build</Eyebrow>
          {handoff ? (
            <h2 id="services-title" className="text-display-l text-ink">
              {em(TITLE)}
            </h2>
          ) : (
            <MaskReveal id="services-title" text={TITLE} className="text-display-l text-ink" />
          )}
        </div>
        <div className="flex items-center gap-6">
          <p className="hidden max-w-[22ch] text-right font-mono text-meta uppercase text-ink-3 md:block">
            Drag, flick or use ← → · Click the centre card to open
          </p>
          <PillButton href="/services" variant="outline" className="shrink-0">
            All services
          </PillButton>
        </div>
      </div>

      {/* Just tall enough that cards bent by the lens at the sides don't get
          clipped, without a big empty band between the heading and the cards.
          Cards are CARD_HEIGHT of this, so they keep their size. */}
      <div ref={stageRef} className="relative mt-2 h-[clamp(580px,88vh,890px)] md:mt-3">
        {items && (
          <FlexCarousel
            items={items}
            ariaLabel="Services"
            fit="portrait"
            cardHeight={CARD_HEIGHT}
            centerScale={CENTER_SCALE}
            sideScale={0.8}
            centerMinWidth={CENTER_MIN_WIDTH}
            anchorLeft
            centerY={CENTER_Y}
            // Room to draw past the box: bent cards lift at one side and dip
            // at the other, and their shadows need space to fade.
            bleedTop={180}
            bleedBottom={140}
            bend={0.18}
            // The side cards bend a little sooner, in true colour: no rainbow
            // split at their edges (the card glass carries the effect).
            lensWidth={0.66}
            dispersion={0}
            gap={28}
            radius={24}
            captions={false}
            intro={handoff ? "none" : "rise"}
            autoplay
            interval={4.5}
            captureWheel={false}
            focusOnClick={false}
            onSelect={(i) => router.push(SERVICES[i].href)}
          />
        )}
      </div>

      <div ref={footRef} className="relative z-10 mt-2 flex justify-center px-[clamp(16px,4vw,48px)]">
        <TextLink href="/discovery" className="font-mono text-meta uppercase">
          Not sure where you fit? Book a call
        </TextLink>
      </div>

      {/* The same services as plain links, for screen readers and keyboards. */}
      <ul className="sr-only">
        {SERVICES.map((s) => (
          <li key={s.slug}>
            <Link href={s.href}>
              {s.title}: {s.summary}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
