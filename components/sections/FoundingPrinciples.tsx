"use client";

import { useEffect, useRef, useState } from "react";
import { Container } from "@/components/ui/Container";

const SCROLL_DISTANCE_VH = 400;

const WE_TRIGGER = 0.1;
const ARE_TRIGGER = 0.4;
const DZEN_TRIGGER = 0.7;

const GLITCH_CHARS =
  "डीझेन" +
  "ディゼン" +
  "迪禅" +
  "ΝτιΖεν" +
  "ДиЗен" +
  "디젠" +
  "דיזן" +
  "ديزن" +
  "ડીઝેન" +
  "ডিজেন" +
  "零幻界虚" +
  "ΔΞΩΨΛ" +
  "ЖЩЯФ" +
  "01#$%&*+=";

type CharStatus = "hidden" | "scrambling" | "revealed";
type CharState = { status: CharStatus; display: string };

function randomGlitchChar() {
  return GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
}

function WordSlot({
  text,
  className = "",
  playRef,
}: {
  text: string;
  className?: string;
  playRef: React.MutableRefObject<() => void>;
}) {
  const makeHiddenChars = () =>
    text.split("").map((c) => ({ status: "hidden" as CharStatus, display: c }));

  const [chars, setChars] = useState<CharState[]>(makeHiddenChars);
  const timersRef = useRef<Record<number, ReturnType<typeof setTimeout>>>({});

  const clearTimer = (index: number) => {
    const t = timersRef.current[index];
    if (t) {
      clearTimeout(t);
      delete timersRef.current[index];
    }
  };

  const clearAllTimers = () => {
    Object.keys(timersRef.current).forEach((k) => clearTimer(Number(k)));
  };

  const scrambleIn = (index: number, delay: number) => {
    if (text[index] === " ") return;
    clearTimer(index);
    const maxTicks = 4 + Math.floor(Math.random() * 3);
    let tick = 0;

    const step = () => {
      tick += 1;
      setChars((prev) => {
        const next = [...prev];
        next[index] =
          tick >= maxTicks
            ? { status: "revealed", display: text[index] }
            : { status: "scrambling", display: randomGlitchChar() };
        return next;
      });
      if (tick < maxTicks) {
        timersRef.current[index] = setTimeout(step, 35);
      } else {
        clearTimer(index);
      }
    };

    timersRef.current[index] = setTimeout(step, delay);
  };

  useEffect(() => {
    playRef.current = () => {
      clearAllTimers();
      setChars(makeHiddenChars());

      let li = 0;
      text.split("").forEach((c, i) => {
        if (c === " ") return;
        scrambleIn(i, li * 25);
        li += 1;
      });
    };
  });

  useEffect(() => {
    return () => clearAllTimers();
  }, []);

  return (
    <span className={className}>
      {chars.map((c, i) => (
        <span
          key={i}
          style={{
            opacity: c.status === "hidden" ? 0 : 1,
            color: c.status === "scrambling" ? "#ffffff" : "inherit",
            fontSize: c.status === "scrambling" ? "0.75em" : "1em",
            transition: "font-size 0.05s ease",
          }}
        >
          {c.display}
        </span>
      ))}
    </span>
  );
}

export default function FoundingPrinciples() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const triggeredRef = useRef({ we: false, are: false, dzen: false });

  const wePlayRef = useRef<() => void>(() => { });
  const arePlayRef = useRef<() => void>(() => { });
  const dzenPlayRef = useRef<() => void>(() => { });

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollingDown = currentScrollY > lastScrollY;
      lastScrollY = currentScrollY;

      const rect = section.getBoundingClientRect();
      const sectionHeight = rect.height;
      const progress = Math.min(
        Math.max(-rect.top / (sectionHeight - window.innerHeight), 0),
        1
      );

      if (progress < DZEN_TRIGGER) triggeredRef.current.dzen = false;
      if (progress < ARE_TRIGGER) triggeredRef.current.are = false;
      if (progress < WE_TRIGGER) triggeredRef.current.we = false;

      if (!scrollingDown) return;

      if (!triggeredRef.current.we && progress >= WE_TRIGGER) {
        triggeredRef.current.we = true;
        wePlayRef.current();
      } else if (!triggeredRef.current.are && progress >= ARE_TRIGGER) {
        triggeredRef.current.are = true;
        arePlayRef.current();
      } else if (!triggeredRef.current.dzen && progress >= DZEN_TRIGGER) {
        triggeredRef.current.dzen = true;
        dzenPlayRef.current();
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section
      ref={sectionRef}
      id="who-are-we"
      aria-label="Who we are"
      className="relative bg-[#0d0d0c] border-t border-border"
      style={{ height: `${SCROLL_DISTANCE_VH}vh` }}
    >
      <div className="sticky top-0 h-screen flex items-center overflow-hidden">
        <Container>
          <div className="text-center">
            <h2 className="font-serif text-[10rem] leading-none font-bold tracking-[-0.02em] text-[#e5f3e5]">
              <WordSlot text="WE" playRef={wePlayRef} />{" "}
              <WordSlot text="ARE" playRef={arePlayRef} />{" "}
              <em className="italic text-[#a9bdf8]">
                <WordSlot text="DZEN" playRef={dzenPlayRef} />
              </em>
              .
            </h2>
          </div>
        </Container>
      </div>
    </section>
  );
}