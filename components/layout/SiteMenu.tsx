"use client";

import Image from "next/image";
import Link from "next/link";
import { animate, useMotionValue, useMotionValueEvent } from "motion/react";
import { useCallback, useEffect, useRef, useState, type RefObject } from "react";
import { cn } from "@/lib/utils";
import { MENU_ITEMS } from "@/lib/nav";
import { SERVICE_GROUPS, SERVICES } from "@/lib/services";
import { SITE } from "@/lib/site";
import { EASE_OUT_CUBIC, LEG_S, lerpBox, range, type Box } from "@/lib/motion";
import { useLenis } from "@/components/providers/SmoothScroll";
import { PillButton } from "@/components/ui/PillButton";
import type { MenuItem } from "@/types/content";

interface SiteMenuProps {
  open: boolean;
  onClose: () => void;
  /** The MENU button: its box grows into this panel and shrinks back into it. */
  anchorRef: RefObject<HTMLButtonElement | null>;
}

const INSET = 10;
const RADIUS = 20;

/**
 * Fullscreen menu (§5.2), opened with the "same box" motion
 * (docs/redesign/MOTION.md §2): the MENU button's own box grows on all four
 * sides into this panel in one 250ms leg, the content is scaled with the box
 * and fades in once it's mostly open. Closing is the same motion backwards.
 */
export function SiteMenu({ open, onClose, anchorRef }: SiteMenuProps) {
  const lenis = useLenis();
  const [mounted, setMounted] = useState(false);
  const [services, setServices] = useState(false);
  const [preview, setPreview] = useState<MenuItem["preview"]>(MENU_ITEMS[0].preview);
  const panelRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const t = useMotionValue(0);
  const from = useRef<Box | null>(null);

  const target = (): Box => ({
    x: INSET,
    y: INSET,
    w: window.innerWidth - INSET * 2,
    h: window.innerHeight - INSET * 2,
    r: RADIUS,
  });

  const apply = useCallback((v: number) => {
    const panel = panelRef.current;
    const content = contentRef.current;
    const a = from.current;
    if (!panel || !content || !a) return;
    const to = target();
    const b = lerpBox(a, to, v);
    panel.style.left = `${b.x}px`;
    panel.style.top = `${b.y}px`;
    panel.style.width = `${b.w}px`;
    panel.style.height = `${b.h}px`;
    panel.style.borderRadius = `${b.r}px`;
    const s = Math.min(b.w / to.w, b.h / to.h);
    content.style.width = `${to.w}px`;
    content.style.height = `${to.h}px`;
    content.style.transform = `translate3d(${(b.w - to.w * s) / 2}px, ${(b.h - to.h * s) / 2}px, 0) scale(${s})`;
    content.style.opacity = String(range(v, 0.5, 0.95));
  }, []);

  useMotionValueEvent(t, "change", apply);

  // Open: measure the button, mount, grow. Close: shrink back, unmount.
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (open) {
      const btn = anchorRef.current?.getBoundingClientRect();
      from.current = btn
        ? { x: btn.left, y: btn.top, w: btn.width, h: btn.height, r: btn.height / 2 }
        : target();
      setServices(false);
      setMounted(true);
      lenis?.stop();
      requestAnimationFrame(() => {
        apply(t.get());
        if (reduce) t.set(1);
        else animate(t, 1, { duration: LEG_S, ease: EASE_OUT_CUBIC });
      });
    } else if (mounted) {
      const btn = anchorRef.current?.getBoundingClientRect();
      if (btn) from.current = { x: btn.left, y: btn.top, w: btn.width, h: btn.height, r: btn.height / 2 };
      lenis?.start();
      const done = () => setMounted(false);
      if (reduce) {
        t.set(0);
        done();
      } else animate(t, 0, { duration: LEG_S, ease: EASE_OUT_CUBIC }).then(done);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // Keep the open panel sized to the window.
  useEffect(() => {
    if (!mounted) return;
    const onResize = () => apply(t.get());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [mounted, apply, t]);

  // Esc closes; Tab stays inside the menu (and the CLOSE button).
  useEffect(() => {
    if (!open) return;
    const panel = panelRef.current;
    const first = panel?.querySelector<HTMLElement>("a, button");
    first?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        anchorRef.current?.focus();
        return;
      }
      if (e.key !== "Tab" || !panel) return;
      const items = [
        anchorRef.current,
        ...panel.querySelectorAll<HTMLElement>("a[href], button:not([disabled])"),
      ].filter(Boolean) as HTMLElement[];
      const i = items.indexOf(document.activeElement as HTMLElement);
      const next = e.shiftKey ? (i <= 0 ? items.length - 1 : i - 1) : i === items.length - 1 ? 0 : i + 1;
      e.preventDefault();
      items[next]?.focus();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose, anchorRef]);

  if (!mounted) return null;

  const items = MENU_ITEMS.filter((item) => !item.hidden);

  return (
    <div
      ref={panelRef}
      id="site-menu"
      role="dialog"
      aria-modal="true"
      aria-label="Site menu"
      data-lenis-prevent
      className="fixed z-40 overflow-hidden bg-paper shadow-[0_30px_80px_-20px_rgba(6,26,61,0.35)]"
      style={{ left: 0, top: 0, width: 0, height: 0 }}
    >
      <div ref={contentRef} className="absolute left-0 top-0 origin-top-left overflow-y-auto opacity-0">
        <div className="relative flex min-h-full flex-col px-[clamp(20px,5vw,72px)] pb-10 pt-28 md:pt-32">
          <div className="grid flex-1 gap-12 lg:grid-cols-[1.35fr_1fr] lg:gap-16">
            {/* Left: numbered links, or the services list */}
            <div>
              {!services ? (
                <ul className="flex flex-col gap-1 md:gap-2">
                  {items.map((item) => (
                    <li key={item.href} onMouseEnter={() => setPreview(item.preview)} onFocus={() => setPreview(item.preview)}>
                      {item.hasServices ? (
                        <button
                          type="button"
                          onClick={() => setServices(true)}
                          aria-expanded={false}
                          className="group/item flex items-baseline gap-4 text-left md:gap-6"
                        >
                          <MenuLabel item={item} />
                          <span
                            aria-hidden="true"
                            className="ml-1 inline-flex size-6 translate-y-[-0.35em] items-center justify-center rounded-full border border-line-strong text-[13px] text-ink-2 transition-colors duration-fast group-hover/item:border-ink group-hover/item:text-ink"
                          >
                            +
                          </span>
                        </button>
                      ) : (
                        <Link href={item.href} onClick={onClose} className="group/item flex items-baseline gap-4 md:gap-6">
                          <MenuLabel item={item} />
                        </Link>
                      )}
                      {item.children && (
                        <ul className="mb-2 mt-2 flex flex-wrap gap-2 pl-[calc(1rem+2.5ch)] md:pl-[calc(1.5rem+2.5ch)]">
                          {item.children.map((child) => (
                            <li key={child.href}>
                              <Link
                                href={child.href}
                                onClick={onClose}
                                className="inline-flex h-9 items-center rounded-pill border border-line px-4 text-[14px] font-medium text-ink-2 transition-colors duration-fast hover:border-ink hover:text-ink"
                              >
                                {child.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <div>
                  <div className="flex items-center justify-between gap-4 border-b border-line pb-4">
                    <button
                      type="button"
                      onClick={() => setServices(false)}
                      className="inline-flex h-9 items-center gap-2 rounded-pill border border-line px-4 font-mono text-[12px] font-medium uppercase tracking-[0.12em] text-ink transition-colors duration-fast hover:border-ink"
                    >
                      <span aria-hidden="true">←</span> Back to menu
                    </button>
                    <span className="hidden font-mono text-meta uppercase text-ink-3 sm:inline">Explore services</span>
                    <Link
                      href="/services"
                      onClick={onClose}
                      className="font-mono text-[12px] font-semibold uppercase tracking-[0.12em] text-ink hover:text-accent"
                    >
                      All services →
                    </Link>
                  </div>
                  <div className="mt-8 grid gap-10 sm:grid-cols-2">
                    {SERVICE_GROUPS.map((group) => (
                      <div key={group.id}>
                        <p className="font-mono text-meta uppercase text-ink-3">{`// ${group.label}`}</p>
                        <ul className="mt-4 flex flex-col gap-3">
                          {SERVICES.filter((s) => s.group === group.id).map((service) => (
                            <li key={service.slug}>
                              <Link
                                href={service.href}
                                onClick={onClose}
                                className="group/svc flex items-baseline gap-3 text-[clamp(1.125rem,1.6vw,1.375rem)] font-medium text-ink"
                              >
                                <span className="font-mono text-[12px] text-ink-3 transition-colors duration-fast group-hover/svc:text-accent">
                                  {service.index}
                                </span>
                                <span className="transition-transform duration-med ease-expo group-hover/svc:translate-x-1">
                                  {service.title}
                                </span>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right: preview card, CTA, contact */}
            <div className="flex flex-col gap-8 border-line lg:border-l lg:pl-12">
              <div className="hidden items-center gap-5 rounded-[20px] border border-line bg-surface p-4 lg:flex">
                <div className="relative h-[90px] w-[110px] shrink-0 overflow-hidden rounded-media bg-night">
                  <Image src={preview.image} alt={preview.alt} fill sizes="110px" className="object-cover" />
                </div>
                <div className="min-w-0">
                  <p className="font-mono text-meta uppercase text-accent">{preview.tag}</p>
                  <p className="mt-1.5 text-[15px] font-medium text-ink-2">{preview.description}</p>
                </div>
              </div>
              <PillButton href="/discovery" variant="dark" className="self-start" onClick={onClose}>
                Book a discovery call
              </PillButton>
              <div className="flex flex-col gap-2 text-[15px] text-ink">
                <a href={`mailto:${SITE.email}`} className="w-fit hover:text-accent">
                  {SITE.email}
                </a>
                <a href={SITE.whatsapp.chatHref} target="_blank" rel="noopener noreferrer" className="w-fit hover:text-accent">
                  WhatsApp {SITE.whatsapp.display}
                </a>
              </div>
              <div>
                <p className="font-mono text-meta uppercase text-ink-3">Follow</p>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {SITE.socials.map((s) => (
                    <li key={s.href}>
                      <a
                        href={s.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex h-9 items-center gap-1.5 rounded-pill border border-line px-4 text-[13px] font-medium text-ink transition-colors duration-fast hover:border-ink"
                      >
                        {s.label} <span aria-hidden="true">↗</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <span
            aria-hidden="true"
            lang="hi"
            className="deva pointer-events-none absolute bottom-[-0.12em] left-1/2 -translate-x-1/2 select-none whitespace-nowrap text-[min(28vw,240px)] leading-none text-ink opacity-[0.04]"
          >
            स्वयत्ता
          </span>
        </div>
      </div>
    </div>
  );
}

function MenuLabel({ item }: { item: MenuItem }) {
  return (
    <>
      <span className="w-6 shrink-0 font-mono text-[13px] font-semibold text-ink-3 transition-colors duration-fast group-hover/item:text-accent">
        {item.index}
      </span>
      <span
        className={cn(
          "font-display text-[clamp(2rem,3.6vw,3.25rem)] font-medium leading-[1.1] tracking-[-0.025em] text-ink",
          "transition-transform duration-med ease-expo group-hover/item:translate-x-1.5"
        )}
      >
        {item.label} <em className="em">{item.labelEm}</em>
      </span>
    </>
  );
}
