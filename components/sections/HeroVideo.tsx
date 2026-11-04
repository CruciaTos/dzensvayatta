"use client";

import { useEffect, useRef } from "react";

interface HeroVideoProps {
  src: string;
  poster: string;
  className?: string;
}

/**
 * Background video that never competes with the first paint: the poster shows
 * first, the video source is attached when the browser is idle, and playback
 * pauses while the hero is off screen. Reduced motion keeps the poster.
 */
export function HeroVideo({ src, poster, className }: HeroVideoProps) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const attach = () => {
      video.src = src;
      video.play().catch(() => {});
    };
    const idle = window.requestIdleCallback
      ? window.requestIdleCallback(attach, { timeout: 2500 })
      : window.setTimeout(attach, 1200);

    const observer = new IntersectionObserver(([entry]) => {
      if (!video.src) return;
      if (entry.isIntersecting) video.play().catch(() => {});
      else video.pause();
    });
    observer.observe(video);

    return () => {
      if (window.cancelIdleCallback) window.cancelIdleCallback(idle as number);
      else window.clearTimeout(idle as number);
      observer.disconnect();
    };
  }, [src]);

  return (
    <video
      ref={ref}
      poster={poster}
      muted
      loop
      playsInline
      preload="none"
      aria-hidden="true"
      className={className}
    />
  );
}
