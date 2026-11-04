# Rules for every agent on the Svayatta redesign

Several AI agents edit this repo **at the same time, in the same folder**. Claude Code owns the design system, the global shell and the hard parts. You own only the files your task lists. Follow these rules exactly.

The full spec is in `docs/redesign/02-svayatta-redesign-plan.md` ("the plan"). The Kawaki teardown it's based on is `docs/redesign/01-kawaki-design-teardown.md`.

---

## 1. Stay in your lane

- **Create or edit only the files under "YOU OWN" in your task.** If another file needs a change, don't make it. Write it under "Notes for Claude" in your final report.
- **Never edit:** `package.json`, `package-lock.json`, `tailwind.config.ts`, `app/globals.css`, `app/layout.tsx`, `app/page.tsx`, anything in `components/ui/`, `components/motion/`, `components/reactbits/`, `lib/motion.ts`, `lib/nav-progress.ts`, `lib/intro.ts`, `components/layout/Navbar.tsx`, `components/layout/SiteMenu.tsx`, `components/layout/ContactPill.tsx`, `components/sections/index.ts`, `next.config.ts`, `types/content.ts`, `lib/rich.tsx`.
- **Never delete or rename** a file you don't own. Old sections (FoundingPrinciples, WhyUs, CaseStudies…) are removed by Claude at the end.
- **No git commands** (no commit, branch, checkout, stash, reset). **No `npm install`**, no new dependencies.
- **Don't start a dev server and don't run `next build`.** Parallel servers share the `.next` folder and corrupt each other. One dev server runs at **http://localhost:3000**. If it isn't responding, ask the user to run `npm run dev` once.
- **Type-check** with `npx tsc --noEmit`. Other agents' files may be half-written, so only fix errors in files you own.
- **Preview routes:** if your task says so, you may create `app/dev/<your-id>/page.tsx` to look at your sections at `http://localhost:3000/dev/<your-id>`. Claude deletes `app/dev/` before launch.

## 2. Decisions already locked (plan §1)

- **D1 Brand:** "Svayatta" is the only public name. Never write DZen / DZEN / Dzen Svayatta / DZenSvayatta. Legal line: "Svayatta Intelligence Private Limited".
- **D2 Theme:** light editorial. Paper white, ink text. Night (`--night`, #000B12) appears only in the hero, the closing CTA band and dark bands on product pages.
- **D3 Fonts (updated 3 Nov; overrides every other font mention in the plan and prompts): only fonts from `C:\Soham\Fonts` — nothing else, ever.** Schibsted Grotesk for headings and all display/title sizes (applied automatically to h1–h4 and the `text-display-*`, `text-mega`, `text-title-*` classes; or use `font-display`) · Host Grotesk for body (`font-sans`) and for uppercase eyebrows/meta (`font-mono` now means this, with tabular figures) · Fraunces Italic for emphasis words (`font-serif`, `.em`). **Zaslia and Rozha One are gone**: the wordmark is "SVAYATTA" in Schibsted Grotesk (semibold, tracking 0.2em); the footer watermark is outlined Schibsted Grotesk; स्वयत्ता uses the `.deva` class (the visitor's own Devanagari font, since none of the brand fonts cover Devanagari). Never add a font file, a Google Font or a `font-family` that isn't one of these.
- **D4 Accent:** `accent` (#0B5C82) for text and links on white · `sky` (#7EC3E2) for fills, dots and anything on night · `tint` (#E7F2F8) for chip backgrounds. **Never put `text-sky` on a white background.**

## 3. Design tokens: use these classes, never hard-coded hex

| Kind | Classes |
|---|---|
| Backgrounds | `bg-paper` `bg-surface` `bg-tint` `bg-night` `bg-ink` `bg-sky` |
| Text | `text-ink` `text-ink-2` `text-ink-3` `text-accent` `text-paper` `text-night-ink` `text-night-muted` `text-sky` (night only) |
| Borders | `border-line` `border-line-soft` `border-line-strong` `border-night-line` `border-ink` |
| Fonts | `font-display` (Schibsted Grotesk) `font-sans` (Host Grotesk) `font-serif` (Fraunces italic) `font-mono` (Host Grotesk meta labels) `font-zaslia` `font-deva` |
| Type scale (size + line height + tracking + weight bundled) | `text-display-xl` `text-display-l` `text-display-m` `text-mega` `text-title-l` `text-title-m` `text-title-s` `text-lead` `text-body` `text-small` `text-eyebrow` `text-meta` `text-button` |
| Radius | `rounded-pill` `rounded-card` (16px) `rounded-media` (12px) `rounded-chip` (4px) `rounded-island` (14px) |
| Shadow | `shadow-hover` (card hover only) `shadow-nav` |
| Motion | `ease-expo` · `duration-fast` (200) `duration-med` (320) `duration-slow` (700) `duration-reveal` (1000) |

**Helper classes in `globals.css`:**
- `.em`: Fraunces italic 400 in `ink-2`. Any `<em>` inside an h1/h2/h3 gets it automatically.
- `.on-night`: put on a night section; italics inside it inherit the text colour.
- `.deva`: Rozha One for स्वयत्ता (1.05em, no tracking).
- `.section`: vertical section padding (64px mobile, 96px desktop).

**Rich strings:** content uses `*asterisks*` for the italic-serif words and `\n` for line breaks. Render with `em()` from `@/lib/rich`; strip for plain text with `plain()`.
```tsx
import { em } from "@/lib/rich";
<h2>{em("Products *we've shipped*")}</h2>
```

## 4. Shared components (built by Claude in `components/ui/`; read the source before using)

`Container` · `Section` (`tone="paper" | "surface" | "night"`) · `SectionHeader` (`eyebrow`, `title`, `action={{ label, href }}`, `as`, `tone`) · `PillButton` (`variant="outline" | "dark" | "light" | "sky"`, `href`, `size`) · `TextLink` · `ArrowCircle` · `Eyebrow` · `Tag` (`variant="tint" | "soft" | "mono" | "onImage" | "status"`) · `Reveal` (`delay`) · `Marquee` · `CellGrid` (`cols={2|3|4}`) · `EditorialCard` · `ProcessCard` · `Accordion` · `MediaFrame` · `LiveClock` · `Breadcrumbs`.

Shared sections (in `components/sections/`, built by Claude): `CTABand` (the night closing band) and `FAQSection` (`items: FaqItem[]`).

## 5. Page and code conventions

- **The root layout renders the nav, the footer, the WhatsApp pill and the `<main id="main-content">` wrapper.** Pages and sections must not render `<Navbar/>`, `<Footer/>` or `<main>`.
- The nav is a fixed floating bar. The first section on any page needs about **160px top padding** (`pt-40`) so content clears it, unless it's a full-bleed night hero.
- **Server components by default.** Add `"use client"` only for state, effects or event handlers, and keep client components small.
- Internal links use `next/link`. Images use `next/image` with `sizes` set. Named exports (`export function Manifesto()`).
- Content (lists, copy used in more than one place) comes from `lib/*.ts`, typed by `types/content.ts`.
- **Accessibility:** one `<h1>` per page, headings in order, visible focus (`globals.css` handles `:focus-visible`), tap targets ≥ 44px, hover-only info also reachable by keyboard/tap, `alt` text that describes the image. Respect `prefers-reduced-motion` (use `Reveal`, which already does).
- **Motion:** read `docs/redesign/MOTION.md` first. In your sections use only `Reveal`, hovers and the marquee; the "same box" scenes, page transitions, intro and loaders are Claude's (`components/motion/*`, `lib/motion.ts`, `NavigationEffects`). Don't add scroll-pinning, parallax, GSAP timelines or three.js yourself. React Bits pieces go only where `MOTION.md` §6 assigns them, using the copies in `components/reactbits/` (never re-download them).
- **Shared-element hooks:** on work cards that link to `/projects/<slug>`, put `data-vt-media` on the card's media element (EditorialCard callers: wrap or pass through). Links to `/discovery` grow into the booking card automatically; add `data-vt-skip` to opt out.

## 6. Copy rules

- Plain English for Indian business owners. Short sentences. "We" and "you". Verb-first CTAs: Book, See, Start, Read, Request.
- Indian/British spelling: optimise, organisation, colour.
- **Never invent facts:** no client numbers, certifications, partnerships or prices that aren't in the plan or the repo.
- **`[confirm]` items:** anything the plan marks `[confirm]` is a fact only the founders can give. Write the most conservative sensible version, and put a code comment `// [confirm] <what's needed>` (or `{/* [confirm] … */}` in JSX) next to it. **Never put `[confirm]`, `TODO` or placeholder brackets inside text that renders on the page.** Same for missing images: `// [asset] <what's needed>`.

## 7. Final report (reply with this when you finish)

1. **Files**: each file you created or changed, with one line on what it does.
2. **Placeholders**: every `[confirm]` and `[asset]` you left, as `file:line — what's needed`.
3. **Checks**: the result of `npx tsc --noEmit` for your files, and what you looked at in the browser.
4. **Notes for Claude**: changes needed in files you don't own (exact file and what to change).
