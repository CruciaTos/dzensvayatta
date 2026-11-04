import { motionValue } from "motion/react";

/**
 * The home page's hand-off from "Who we are" to Services, 0–1: how far the
 * manifesto's footage panel has wiped to white. WeAreSvayatta drives it and
 * ServicesTrack fades in along it, so the two read as one page. It rests at 1
 * when nothing drives it, so Services is never left hidden.
 */
export const manifestoHandoff = motionValue(1);

/** The wipe's slanted, soft edge, in px on screen. */
export interface WipeEdge {
  /** Where the edge meets the top of the screen. */
  top: number;
  /** Where it meets the bottom of the screen (its foot runs out first). */
  foot: number;
  /** Half the width of the soft band across the edge. */
  feather: number;
  /** The screen height the edge runs down. */
  height: number;
}

// The edge with nothing left to hide.
export const ALL_WHITE: WipeEdge = { top: 0, foot: 0, feather: 0, height: 1 };

/**
 * The edge as it stands. Services shows only on the white side of it, so it
 * never sits on the panel.
 */
export const manifestoEdge = motionValue<WipeEdge>(ALL_WHITE);

/** True when the edge (soft band included) is off the left of the screen: all white. */
export const edgeGone = (e: WipeEdge) => e.top + e.feather <= 0;

/**
 * A CSS mask that hides whatever lies left of the edge and shows what's right
 * of it, blended across the soft band. `box` is the masked element's rect on
 * screen, so the same edge lines up across different elements.
 */
export function edgeMask(e: WipeEdge, box: { left: number; top: number; width: number; height: number }): string {
  // The gradient runs across the edge, pointing at the white side.
  const angle = Math.atan2(e.height, e.foot - e.top);
  const ux = Math.sin(angle);
  const uy = -Math.cos(angle);
  const length = Math.abs(box.width * ux) + Math.abs(box.height * uy);
  // How far along the gradient the edge sits (measured at its top point).
  const at = (e.top - (box.left + box.width / 2)) * ux + (0 - (box.top + box.height / 2)) * uy + length / 2;
  const deg = ((angle * 180) / Math.PI).toFixed(3);
  // Eased stops across the band, so it melts like a heavy blur instead of a flat ramp.
  const stops = [0, 0.03, 0.12, 0.27, 0.5, 0.73, 0.88, 0.97, 1]
    .map((a, i, all) => {
      const x = at - e.feather + (2 * e.feather * i) / (all.length - 1);
      return `rgba(0,0,0,${a}) ${x.toFixed(1)}px`;
    })
    .join(", ");
  return `linear-gradient(${deg}deg, ${stops})`;
}

/** Puts a mask on an element (or takes it off), with the prefixed copy for Safari. */
export function setMask(el: HTMLElement, mask: string) {
  el.style.setProperty("mask-image", mask || null);
  el.style.setProperty("-webkit-mask-image", mask || null);
}
