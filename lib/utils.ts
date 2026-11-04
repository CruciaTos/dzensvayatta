import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

// tailwind-merge has to know the custom tokens in tailwind.config.ts.
// Without this it reads `text-display-l` as a colour and drops it when a
// colour like `text-ink` comes later in the same cn() call.
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [
        {
          text: [
            "display-xl",
            "display-l",
            "display-m",
            "mega",
            "title-l",
            "title-m",
            "title-s",
            "lead",
            "body",
            "small",
            "eyebrow",
            "meta",
            "button",
          ],
        },
      ],
      "font-family": [{ font: ["deva", "display"] }],
      rounded: [{ rounded: ["pill", "island", "card", "media", "chip"] }],
      shadow: [{ shadow: ["hover", "nav"] }],
      duration: [{ duration: ["fast", "med", "slow", "reveal"] }],
      ease: [{ ease: ["expo"] }],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
