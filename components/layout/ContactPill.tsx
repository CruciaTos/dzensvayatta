"use client";

import { siWhatsapp } from "simple-icons";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { SITE } from "@/lib/site";
import { isStudioOpen } from "@/lib/time";

/**
 * Floating WhatsApp pill, bottom centre (§5.3). The dot is green during studio
 * hours (10:00–22:00 IST). Hidden while the menu is open or the footer's
 * contact row (#footer-contact) is on screen.
 */
export function ContactPill({ menuOpen }: { menuOpen: boolean }) {
  const [open, setOpen] = useState(false);
  const [footerVisible, setFooterVisible] = useState(false);

  useEffect(() => {
    const tick = () => setOpen(isStudioOpen());
    tick();
    const id = window.setInterval(tick, 60_000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    const target = document.getElementById("footer-contact");
    if (!target) return;
    const io = new IntersectionObserver(([entry]) => setFooterVisible(entry.isIntersecting), { threshold: 0.1 });
    io.observe(target);
    return () => io.disconnect();
  }, []);

  const hide = menuOpen || footerVisible;

  return (
    <div
      className={cn(
        "pointer-events-none fixed inset-x-0 bottom-4 z-30 flex justify-center transition-[opacity,transform] duration-med ease-expo md:bottom-5",
        hide ? "translate-y-4 opacity-0" : "opacity-100"
      )}
      style={{ viewTransitionName: "contact-pill" }}
    >
      <a
        href={SITE.whatsapp.chatHref}
        target="_blank"
        rel="noopener noreferrer"
        tabIndex={hide ? -1 : 0}
        aria-hidden={hide || undefined}
        className="pointer-events-auto flex h-12 items-center gap-3 rounded-pill bg-ink pl-4 pr-1.5 text-paper shadow-[0_14px_34px_-12px_rgba(6,26,61,0.55)] transition-transform duration-med ease-expo hover:-translate-y-0.5"
      >
        <span aria-hidden="true" className={cn("size-2 rounded-full", open ? "bg-success" : "bg-night-muted")} />
        <span className="text-[14px]">
          <span className="font-semibold">Svayatta</span>
          <span className="hidden text-paper/70 min-[400px]:inline"> · Chat on WhatsApp</span>
        </span>
        <span className="flex size-9 items-center justify-center rounded-full bg-sky text-night">
          <svg viewBox="0 0 24 24" width="17" height="17" fill="currentColor" aria-hidden="true">
            <path d={siWhatsapp.path} />
          </svg>
        </span>
        <span className="sr-only">(opens WhatsApp)</span>
      </a>
    </div>
  );
}
