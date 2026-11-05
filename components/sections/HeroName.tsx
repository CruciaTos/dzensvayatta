"use client";

import DitherVeilWord, { type DitherVeilWordProps } from "@/components/reactbits/DitherVeilWord";
import { useHeroCovered } from "@/lib/heroCover";

/** The hero's name swap, held still while the sheet covers the hero. */
export function HeroName(props: Omit<DitherVeilWordProps, "paused">) {
  const covered = useHeroCovered();
  return <DitherVeilWord {...props} paused={covered} />;
}
