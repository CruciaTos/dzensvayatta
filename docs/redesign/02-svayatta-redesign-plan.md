# svayatta.in redesign plan: section by section

> **File 2 of 2.** Read File 1 (`01-kawaki-design-teardown.md`) for the Kawaki breakdown and the audit of the current site.
>
> This file says exactly what to change on svayatta.in and in what order. Every numbered block below is meant to be **one small PR you can ship on its own**.

**Legend**
- **KEEP** (unchanged) · **RESTYLE** (same content, new look) · **REPLACE** (new content and component) · **ADD** (new) · **REMOVE** · **MOVE** (goes to another page).
- `Files:` points into your repo, `CruciaTos/Website-Identity-Dzen`.
- `[confirm]` marks a fact or policy only you can confirm. Don't publish it until you have.

---

## 0. Ground rules (taken from Kawaki, made ours)

1. **White canvas, ink text, one accent.** Svayatta blue is used sparingly. The dark "night" colour appears in only two places: the hero and the closing CTA band.
2. **One heading formula:** a plain phrase plus *one or two italic-serif words*. "Products *we've shipped*", "How we *build*".
3. **One section header everywhere:** `// eyebrow`, an H2, and an outline pill on the right.
4. **Hairlines instead of shadows and glass.** Radius: pills 999px, cards 16px, media 12px.
5. **Small, slow motion:** reveals, hovers, one marquee. No scroll-pinned sequences on the home page apart from the hero entrance.
6. **The proof is ours:** our products, our clients, our numbers. No borrowed news, no memes, no stock thumbs-up photos.
7. **Plain English for Indian business owners.** No jargon padding.
8. **Inspired by, not a clone of, Kawaki:** different typefaces, a different accent, our own words, and a Devanagari signature that Kawaki can't have.

---

## 1. Decisions to lock before writing code

| ID | Decision | Recommendation | Alternatives |
|---|---|---|---|
| **D1** | Brand architecture | **"Svayatta" is the only public brand**: logo, titles, schema and footer. The legal line becomes **"Svayatta Intelligence Private Limited"** once the incorporation certificate is issued. DZen is either retired or mentioned once in the About story. Delete "WE ARE DZEN.", the footer "DZ" watermark, "DZen, Inc." and "DZenSvayatta". | Make DZen the master brand with Svayatta as its tech division. Not recommended: your domain, legal entity and logo are all Svayatta. |
| **D2** | Theme | **Light editorial**, like Kawaki: paper white with ink text. **Night `#000B12`** is kept for the hero, the closing CTA band and the dark bands on product pages. This keeps your current dark identity as an accent. | (b) Keep a fully dark site but adopt Kawaki's structure and type. That's cheaper, but you lose most of the "clean" look you liked. |
| **D3** | Typefaces | **Geist** (already loaded) at weight 300 for display · **Newsreader Italic** (new, Google Fonts) for the emphasis words · **IBM Plex Mono** (already loaded) for meta · **Rozha One** (already local) for स्वयत्ता · **Zaslia** for the wordmark and watermark only. Remove DM Serif Display. | Instrument Serif. **Avoid it**: it's Kawaki's signature, and using it plus their layout is a clone. Other options: Fraunces Italic (more playful), Cormorant Garamond Italic (more luxe). |
| **D4** | Accent | Split Svayatta blue into three tokens: `--accent #0B5C82` for text and links on white (7.3:1 contrast); `--sky #7EC3E2` for fills, dots and anything on night (10.2:1 on night); `--tint #E7F2F8` for chip backgrounds. **Never put `#7EC3E2` text on white**: it's 1.95:1. | — |
| **D5** | Imagery | **Real beats generated:** product screenshots in clean device frames, real founder photos, and real or licensed Mumbai photography for the hero. No memes, no stock smiles. | A calm abstract night visual for the hero (the current petals video is fine *only if* you have the licence). |
| **D6** | Pages and URLs | See the table below. | — |

### D6: Site map (new)

| Route | Status | Page |
|---|---|---|
| `/` | REBUILD | Home |
| `/projects` | REPLACE | **Work hub**. Today this URL is the CruSam page; it becomes the grid of all products. |
| `/projects/crusam` | ADD | CruSam case study (content moves here from today's `/projects`) |
| `/projects/growmont` | RESTYLE | Growmont CRM case study, keeping the gated download |
| `/projects/growmont-pms` | RESTYLE | Growmont PMS (in development) |
| `/projects/crudoc` | ADD later | CruDoc, when you're ready to show it `[confirm]` |
| `/about` | ADD | Story, founders, principles, partners. Replaces the Founders drawer. |
| `/services` | ADD | Services hub + "Where we help" (the business functions) |
| `/services/[slug]` | ADD (phase 4) | Service detail template. Start with two pages. |
| `/discovery` | RESTYLE | Booking page. Keep the API. |
| `/insights`, `/insights/[slug]` | ADD (phase 4) | Blog, only once 3 posts are ready |
| `/privacy`, `/terms` | ADD | Legal |
| `not-found` | ADD | 404 |
| `/llms.txt` | ADD | Summary for AI crawlers |

---

## 2. Design system

### 2.1 Colour tokens
Put these in `app/globals.css` and map them in `tailwind.config.ts`.

```css
:root {
  /* light canvas */
  --paper:       #FFFFFF;
  --surface:     #F5F8FA;   /* alt bands, media backgrounds, number chips */
  --tint:        #E7F2F8;   /* accent chip background */
  /* ink */
  --ink:         #0A1218;   /* headings, body, dark buttons      18.9:1 on paper */
  --ink-2:       #3B4650;   /* secondary text, italic emphasis    9.6:1 */
  --ink-3:       #5F6B75;   /* meta, eyebrows, captions           5.5:1 (AA) */
  /* lines */
  --line-soft:   rgba(10,18,24,.06);
  --line:        rgba(10,18,24,.10);
  --line-strong: rgba(10,18,24,.22);
  /* brand */
  --accent:      #0B5C82;   /* text/links on light                7.3:1 */
  --sky:         #7EC3E2;   /* fills, dots, on-night accents     10.2:1 on night */
  --night:       #000B12;   /* hero, CTA band, dark bands */
  --night-ink:   #E9F1F5;   /* text on night                     17.4:1 */
  --night-muted: #9AA8B2;   /* secondary text on night            8.2:1 */
  --night-line:  rgba(233,241,245,.14);
  /* states */
  --success:     #1E8E5A;
  --danger:      #B42318;
}
```

**Tailwind mapping** (replaces the `colors` block in `tailwind.config.ts`):

```ts
colors: {
  paper: "var(--paper)", surface: "var(--surface)", tint: "var(--tint)",
  ink: { DEFAULT: "var(--ink)", 2: "var(--ink-2)", 3: "var(--ink-3)" },
  line: { soft: "var(--line-soft)", DEFAULT: "var(--line)", strong: "var(--line-strong)" },
  accent: "var(--accent)", sky: "var(--sky)",
  night: { DEFAULT: "var(--night)", ink: "var(--night-ink)", muted: "var(--night-muted)", line: "var(--night-line)" },
},
```

- **Remove the old palette:** `background #000b12`, `foreground #e5f3e5`, `accent #7EC3E2`, the `stone.*` shades and `border.*`.
- **Audit the shadcn layer first:** `@import "shadcn/tailwind.css"` and its oklch `:root` / `.dark` variables. If nothing uses shadcn components after the rebuild, delete it.

### 2.2 Typography

**`app/layout.tsx` font setup:**

```ts
import { Geist, Newsreader, IBM_Plex_Mono } from "next/font/google";
import localFont from "next/font/local";

const sans  = Geist({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const serif = Newsreader({ subsets: ["latin"], style: ["italic"], axes: ["opsz"], variable: "--font-serif", display: "swap" });
const mono  = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-mono", display: "swap" });
const zaslia = localFont({ src: "../public/fonts/zaslia/Zaslia.otf", variable: "--font-zaslia", display: "swap" });
const deva   = localFont({ src: "../public/fonts/RozhaOne-Regular.ttf", variable: "--font-devanagari", display: "swap" });
// remove DM_Serif_Display
```

**Type scale**

| Token | Used for | Desktop | Mobile (≤640) | Family / weight | Line height | Tracking |
|---|---|---|---|---|---|---|
| `display-xl` | Hero H1 | `clamp(2.6rem, 5.4vw, 5.25rem)` ≈ 78px | 40px | Geist 300 | 1.03 | −0.03em |
| `display-l` | Section H2 | `clamp(2.5rem, 5vw, 4.5rem)` = 72px | 40px | Geist 300 | 1.0 | −0.025em |
| `display-m` | Story H2, inner-page H1 | `clamp(2rem, 3.6vw, 3.25rem)` | 32px | Geist 300 | 1.08 | −0.02em |
| `mega` | CTA band | `clamp(2.8rem, 6.5vw, 5.75rem)` | 44px | Geist 500, uppercase | 0.98 | −0.03em |
| `title-l` | Service cells, product H2 | `clamp(1.75rem, 2.6vw, 2.4rem)` | 26px | Geist 400 | 1.05 | −0.02em |
| `title-m` | Work card title | `clamp(1.4rem, 2vw, 1.8rem)` | 22px | Geist 500 | 1.15 | −0.02em |
| `title-s` | Process / blog card title | 20px | 18px | Geist 600 | 1.3 | −0.01em |
| `lead` | Manifesto paragraphs | `clamp(1.15rem, 1.6vw, 1.4rem)` | 18px | Geist 300 | 1.6 | 0 |
| `body` | Paragraphs | 17px | 16px | Geist 400 | 1.65 | 0 |
| `small` | Card descriptions | 14.5px | 14px | Geist 400, `ink-2` | 1.6 | 0 |
| `eyebrow` | `// LABEL` | 12px | 11px | Plex Mono 600, uppercase, `ink-3` | 1 | 0.14em |
| `meta` | Dates, categories, status | 12px | 11px | Plex Mono 500, uppercase, `ink-3` | 1.3 | 0.12em |
| `button` | Pill labels | 14px | 14px | Geist 500 | 1 | 0.02em |

**The `<em>` rule (the core of the look):**

```css
.em, h1 em, h2 em, h3 em {
  font-family: var(--font-serif); font-style: italic; font-weight: 300;
  letter-spacing: -0.01em; color: var(--ink-2);
}
.on-night .em, .on-night h1 em, .on-night h2 em { color: inherit; } /* white italics in the hero, as Kawaki does */
```

- **Devanagari:** `.deva { font-family: var(--font-devanagari); letter-spacing: 0; }`. Use it only for स्वयत्ता, and at 1.05em relative to the surrounding text.
- **Zaslia:** only the nav wordmark and the giant footer watermark. Never body text, never headings.

### 2.3 Layout and spacing
- **Container:** `width: min(88vw, 1280px); margin-inline: auto;`. Below 640px use a 20px side gutter. Update `components/ui/Container.tsx`.
- **Section padding:** 96px top and bottom on desktop, 64px on mobile. Header-to-content gap: 48px (32px on mobile).
- **Grid gaps:** 20px (cards), 32–40px (work cards), 0 (cell grids, which use hairlines instead).
- **Breakpoints:** 640 / 768 / 1024 / 1280 (Tailwind defaults).

### 2.4 Radius, borders, elevation

| Token | Value | Used on |
|---|---|---|
| `rounded-pill` | 999px | buttons, tags, nav island (14px) |
| `rounded-card` | 16px | process cards, work media, booking card |
| `rounded-media` | 12px | thumbnails, menu preview image |
| `rounded-chip` | 4px | number chips |
| Border | `1px solid var(--line)` | cards, cells |
| Hover shadow | `0 16px 36px -12px rgba(10,18,24,.12)` | card hover only |
| Nav shadow | `0 18px 40px -12px rgba(0,0,0,.18), inset 0 1px 0 rgba(255,255,255,.9)` | nav island |

### 2.5 Motion tokens

```css
--ease-out: cubic-bezier(0.16, 1, 0.3, 1);
--dur-fast: 200ms;   /* colour changes */
--dur-med:  320ms;   /* lifts, arrow rotation */
--dur-slow: 700ms;   /* image zoom */
--dur-reveal: 1000ms;
```

- **Reveal:** opacity 0→1, y 24→0, 1.0s `--ease-out`, once, starting when 10% of the element is visible. Stagger children by 0.06–0.08s.
- **Hover:** card lift −4px · image scale 1.035 · arrow rotate 45° · cell colour invert in 0.45s.
- **Marquee:** 32s linear, two rows in opposite directions.
- **Smooth scroll:** keep **Lenis** (`components/providers/SmoothScroll.tsx`).
- **Reduced motion:** under `prefers-reduced-motion: reduce`, turn off reveals, the marquee (show static text), the hero video (show the poster) and any parallax.
- **Libraries:** do everything with `motion` (already installed). After the rebuild, delete `gsap`, `@gsap/react`, `three`, `@react-three/fiber`, `@react-three/postprocessing`, `postprocessing` and `ogl` if no component still imports them.

### 2.6 Icons
- Keep `lucide-react`.
- **The signature icon is `ArrowCircle`:** a 24px circle (filled ink or outlined) holding a 12px ↗ that rotates 45° on hover. When the circle sits inside a dark button it's filled with `--sky` and the icon is `--night`.

### 2.7 Image rules
- **Product shots:** screenshots on `--surface`, inside a thin device frame (`components/ui/DeviceMockup.tsx` can be reused), at 16:10 or 4:3. **Use dummy data.** Never real employee names or salaries, client figures, or patient details.
- **People:** real founder and client photos, all with the same treatment (soft daylight, 4:5 crop, slight desaturation).
- **Formats:** `next/image` everywhere with `sizes` set. AVIF/WebP. Hero poster ≤ 250KB.
- **Banned:** memes, stock thumbs-up photos, generic "robot hand" AI art, and other organisations' logos without written permission.

### 2.8 Voice rules
- **Plain and specific:** "Payroll that used to take two days now takes an afternoon" `[confirm the real number]` beats "operational excellence".
- **Point of view:** "we" and "you". Short sentences. Verb-first CTAs: *Book, See, Start, Read, Request*.
- **One spelling standard:** Indian/British English is recommended (optimise, organisation). Keep it consistent everywhere.
- **Brand lines to reuse:** "We build. You scale.", "Quality with clarity.", "Let's get working."

---

## 3. Shared components (PR 1, build these first)

All go in `components/ui/`. Each is small; together they give every section the same look.

| Component | Props | Spec |
|---|---|---|
| `SectionHeader.tsx` | `eyebrow?: string`, `title: ReactNode`, `action?: { label; href }`, `as?: "h1" \| "h2"`, `tone?: "light" \| "night"` | Flex row, `justify-between`, `items-end`, margin-bottom 48px. Eyebrow uses the `eyebrow` style with a `// ` prefix. Title is `display-l`. Action is an `OutlinePill`. Stacks below 640px with a 20px gap. |
| `PillButton.tsx` | `variant: "outline" \| "dark" \| "light" \| "sky"`, `href`, `icon?: boolean`, `size?: "sm" \| "md"` | Height 44px (md) / 36px (sm), padding 10px 10px 10px 20px, `button` type style. **outline:** 1px ink border; hover fills ink with paper text and the icon inverts and rotates. **dark:** ink bg, paper text, sky ArrowCircle. **light:** white bg, ink text (for the hero). **sky:** sky bg, night text (for night bands). Renders an `<a>`. |
| `TextLink.tsx` | `href`, `children`, `tone` | 14px, underline with 5px offset, ends in →; hover nudges the arrow 3px. |
| `ArrowCircle.tsx` | `filled?`, `size?` | See 2.6. |
| `Eyebrow.tsx` | children | `// ` + mono label. |
| `Tag.tsx` | `variant: "tint" \| "soft" \| "mono" \| "onImage" \| "status"` | **tint:** `--accent` text on `--tint`, 12px 500, padding 5px 12px. **soft:** `ink-2` on `--surface` with a `--line` border. **mono:** Plex 11.5px, 1px border, uppercase. **onImage:** night glass `rgba(0,11,18,.8)` with blur and white uppercase 11px. **status:** a dot plus LIVE / IN DEVELOPMENT. |
| `Reveal.tsx` | `delay?`, `as?` | Wraps `motion.div` with `whileInView`, `viewport={{ once: true, amount: 0.1 }}`, and respects reduced motion. **Replaces** `ui/FadeIn.tsx` and `components/ScrollReveal.tsx`. |
| `Marquee.tsx` | `items: ReactNode[]`, `direction`, `duration` | A CSS keyframes track rendered twice (the copy is `aria-hidden`), `overflow: clip`, no JS. |
| `CellGrid.tsx` | `cols`, children | The grid has a top and left `--line` border; each cell has a right and bottom border. That gives perfect hairlines with no doubled edges. |
| `EditorialCard.tsx` | `media`, `index`, `category`, `status`, `title`, `subtitle`, `description`, `tags[]`, `href` | See H5 for the full anatomy. |
| `ProcessCard.tsx` | `index`, `label`, `phase`, `title`, `body`, `outcome` | See H7. |
| `Accordion.tsx` | `items: { q: ReactNode; short: string; a: ReactNode }[]`, `defaultOpen?` | Uses `<button aria-expanded aria-controls>` with one item open at a time, keyboard-operable. Also exports `faqJsonLd(items)`. |
| `MediaFrame.tsx` | `src`, `alt`, `ratio`, `zoom?` | Radius 16, `--line` border, `--surface` background, zooms on hover. |
| `LiveClock.tsx` | `tz = "Asia/Kolkata"` | Mono chip showing "09:24 PM IST", updated every 30s. Client component; renders a placeholder on the server so the HTML matches. |
| `Breadcrumbs.tsx` | `items` | Mono 11px, `/` separators, plus BreadcrumbList JSON-LD. |

**Done when:** a temporary `/styleguide` route renders every component in light and night tones with no hydration warnings. Delete the route before launch.

---

## 4. Global shell (PR 2)

### 4.1 `app/layout.tsx`
- Body classes become `bg-paper text-ink font-sans antialiased` (drop `text-stone-100 font-light`).
- **REMOVE** `<GlobalVideoBackground />` and the `SectionFlowProvider` wrapper, after checking that nothing else depends on it.
- **KEEP** `SmoothScroll` and `SpeedInsights`.
- Set `viewport.themeColor` to `#FFFFFF`. On the home page you can override it to the night colour so the mobile browser bar matches the hero.
- Load the fonts from 2.2.

### 4.2 `app/globals.css`
- **Add:** the tokens (2.1), the `.em` and `.deva` rules, and a focus ring: `:focus-visible { outline: 2px solid var(--accent); outline-offset: 3px; border-radius: 6px }`.
- **Add selection colours:** `::selection { background: var(--sky); color: var(--night) }`.
- **REMOVE:** the `.hero-noir-*`, `.hero-grid-bg` and `.noise-overlay` classes.

### 4.3 Files to retire once their sections are rebuilt

| Remove | Why |
|---|---|
| `components/ui/GlobalVideoBackground.tsx`, `public/videos/*` (unless reused in the hero) | The video background on every page is gone |
| `components/ui/DotField.tsx` | Hero dot field |
| `components/sections/HeroSlideTransition.tsx`, `SectionTransition.tsx`, `providers/SectionFlow.tsx` | Slide-over and pin transitions |
| `components/sections/FoundingPrinciples.tsx` | "WE ARE DZEN." |
| `components/sections/WhyUs.tsx` | Merged into the Manifesto |
| `components/sections/CaseStudies.tsx` | News marquee |
| `components/sections/TargetMarkets.tsx` | Moves to `/services` as a simple grid |
| `components/sections/AboutOverlay.tsx` | Replaced by `/about` |
| `components/ui/resizable-navbar.tsx`, `hooks/useActiveSection.ts` | The nav is rebuilt without scroll-spy |
| `public/images/workflow.jpeg`, `blueprint.jpeg`, `build.jpeg`, `deploy.jpeg` | Memes |
| `components/ui/FadeIn.tsx`, `components/ScrollReveal.tsx` | Replaced by `ui/Reveal.tsx` |

---

## 5. Navigation (PR 3)

### 5.1 Top bar: REPLACE `components/layout/Navbar.tsx`
The current file is 770 lines; aim for about 150.

- **Shape:**
  - A floating white glass "island", fixed 20px from the top, `width: min(92vw, 1360px)`, radius 14px, padding 12px 16px 12px 24px.
  - Background `rgba(255,255,255,.82)` with `backdrop-filter: blur(24px) saturate(180%)` and the nav shadow from 2.4.
  - It stays white even over the night hero. That contrast is the effect.
- **Left:** your logo mark plus "SVAYATTA" in Zaslia, 22px. On hover it cross-fades to स्वयत्ता in Rozha One (0.3s). It links to `/` and has `aria-label="Svayatta, home"`.
- **Centre (≥900px):** `INFO@SVAYATTA.IN ↗` in mono, 12px, ls .16em, uppercase. Hover: `--accent` colour, the arrow nudges 2px.
- **Right:**
  - **≥1024px:** a small dark pill "Book a call" linking to `/discovery`.
    - Kawaki has no CTA in its bar. We keep one small one because booking calls is the site's job.
  - Then the `MENU` toggle: 13px 600, ls .14em, with two 22px bars that animate into an ✕ while the label becomes `CLOSE`.
  - The toggle must be a `<button aria-expanded aria-controls="site-menu">`.
- **On scroll:** past 30px, raise the background to .92 opacity. **Hide on scroll down, show on scroll up** (translateY −120%, 0.5s `--ease-out`). It always shows near the top or while the menu is open.
- **Mobile:** 12px inset, logo plus MENU only, radius 12px, padding 10px 14px.
- **Remove:** the six inline links, the scroll-spy pill, the Products dropdown, the `useScrolled` glass/clear switch, and the GET STARTED button. "Book a call" replaces it as a real link.

### 5.2 Fullscreen menu: ADD `components/layout/SiteMenu.tsx`

**Opening:**
- Two layers wipe down from the top: night first, then paper. Each is `scaleY 0→1`, 0.7s, staggered 0.08s.
- Then the content fades up (0.5s), and the links stagger in at 0.06s each.
- With reduced motion it simply appears.

**Left column: numbered links** (`display-m` size, about 52px; index in mono 13px `ink-3`, turning `--accent` on hover):

| # | Label | Goes to |
|---|---|---|
| 01 | Home *Index* | `/` |
| 02 | About *Svayatta* | `/about` |
| 03 | Services *What we build* (+) | opens the sub-panel |
| 04 | Work *Products & clients* | `/projects` |
| 05 | Insights *Notes* | `/insights` (hide until it exists) |
| 06 | Discovery *Call* | `/discovery` |

**Services sub-panel** (swaps into the left column):
- A top bar: `← Back to menu` pill · `EXPLORE SERVICES` (mono) · `All services →`.
- `// AI & AUTOMATION`
  - 01 Agentic AI Systems
  - 02 Conversational AI (WhatsApp & Voice)
  - 03 Machine Learning & Analytics
- `// SOFTWARE`
  - 04 Custom Software & ERP
  - 05 Web & Digital Presence
- `// GROWTH`
  - 06 Content & Growth Marketing
- Each item links to its `/services/[slug]`, or to the `/services` hub until the detail pages exist.

**Right column:**
1. **Preview card:** `--surface` background, radius 20, padding 16. A 110×90 image (radius 12), then a tag (12px 600 uppercase `--accent`) and a description (15px `ink-2`). It swaps on hover, with the content defined per item in `lib/data.ts`:
   - Home → hero still · "SVAYATTA — STUDIO OVERVIEW" · "Software, AI & automation from Mumbai"
   - About → founders photo · "ABOUT — THE TEAM" · "Two founders, one standard"
   - Services → service illustration · "SERVICES" · "Six ways we help"
   - Work → CruSam dashboard · "LIVE AT AARTI ENTERPRISES" · "CruSam payroll & finance ERP"
   - Discovery → calendar image · "30-MINUTE CALL" · "Tell us about your business"
2. A dark pill: "Book a discovery call".
3. `info@svayatta.in` and `WhatsApp +91 91520 35526`.
4. "FOLLOW" with outline pills for LinkedIn ↗ and Instagram ↗.

**Watermark:** "स्वयत्ता" in Rozha One, `min(30vw, 260px)`, opacity .04, bottom-centre. This is our version of Kawaki's italic "kawaki".

**Behaviour:** Esc closes it, focus is trapped inside, `lenis.stop()` while it's open, and it closes on route change. Focus returns to the MENU button afterwards.

**Mobile:** links at 36px, the right column moves below them, and the preview card is hidden.

### 5.3 Floating contact pill: ADD `components/layout/ContactPill.tsx`
- **Where:** fixed bottom-centre, 20px from the bottom. Kawaki uses the same spot on desktop and mobile.
- **Look:** an ink pill with:
  - a **status dot**: `--success` green between 10:00 and 22:00 IST (the same hours `lib/discovery/validate.ts` already enforces), grey otherwise;
  - "**Svayatta** · Chat on WhatsApp";
  - a 32px circle button with the WhatsApp glyph.
- **Link:** `https://wa.me/919152035526?text=Hi%20Svayatta%2C%20I%27d%20like%20to%20talk%20about%20a%20project.`
- **Hidden when:** the menu is open, or the footer's contact row is on screen (IntersectionObserver).
- **Later (phase 4):** swap WhatsApp for your own assistant. A Sarvam-powered chat that speaks Hindi and Marathi would make the pill a live demo of what you sell `[confirm scope]`.

---

## 6. Home page, section by section

**New order (`app/page.tsx`):**

```
<Navbar/>  <main>
  H1 Hero → H2 Marquee → H3 Manifesto → H4 Trusted by → H5 Selected work
  → H6 Services → H7 How we build → H8 Testimonials → [H8b Insights, later] → H9 FAQ → H10 CTA band
</main>  <Footer/>  <ContactPill/>
```

Old home sections and where they go:

| Old section | Goes to |
|---|---|
| Hero (toggle) | H1 (replaced) |
| "Think AI is still far away?" | removed → optional Insights post |
| "WE ARE DZEN." | removed (its spirit goes into H3) |
| Business Functions | moved to `/services` |
| Our Expertise | H6 (restyled) |
| Execution path | H7 (replaced) |
| Testimonials | H8 (restyled) |
| Who We Are | H3 (merged) |
| CTA | H10 (restyled) |
| Footer | rebuilt |

---

### H1. Hero (REPLACE `components/sections/Hero.tsx`; delete `HeroSlideTransition.tsx` and `DotField.tsx`)

**Kawaki reference:** cinematic hero with the H1 bottom-left, a description and 2 CTAs bottom-right, and a hairline meta bar (File 1, A3 block 1).

**Layout**
- A full-bleed `<section class="on-night">`, `height: 100svh`, min 640px, max 960px, background `--night`.
- **Background:** an image or video (see Assets) with `object-fit: cover`, plus an overlay:
  `linear-gradient(180deg, rgba(0,11,18,.45) 0%, rgba(0,11,18,.15) 38%, rgba(0,11,18,.70) 76%, rgba(0,11,18,.94) 100%)`.
- **Content row:** pinned 112px above the bottom, side padding `clamp(20px, 4vw, 64px)`, flex with `justify-between` and `items-end`, gap 64px.
  - **Left:** the H1, max-width 900px.
  - **Right:** a column, max-width 420px, holding the description and the buttons.
- **Meta bar:**
  - Absolutely positioned at the bottom, padding 18px `clamp(20px,4vw,64px)`.
  - Top border `--night-line`, background `rgba(0,11,18,.35)` with a 10px blur.
  - Mono 12px uppercase, ls .1em, at 72% white.

**Copy (draft, so the H1 finally says what you do)**
- **H1:** We build the systems / *your business runs on.*
  - Alternative A: Software, AI & automation / *for businesses ready to scale.*
  - Alternative B: Custom software & AI agents, / *built around how you work.*
- **Description:** Custom software, AI agents and workflow automation for Indian businesses. Scoped with you, shipped in small steps, supported after launch.
- **Primary:** `Book a discovery call →` (light pill → `/discovery`).
- **Secondary:** `See our work →` (text link → `/projects`).
- **Meta bar:**
  - Left: `SOFTWARE · AI · AUTOMATION STUDIO  /  MUMBAI · INDIA`.
  - Centre (≥1024px): `स्वयत्ता — self-governance`, with the Devanagari in `--sky`.
  - Right: `FOLLOW  LINKEDIN +  INSTAGRAM +`.

**Style**
- H1 is `display-xl`, white, with `text-shadow: 0 4px 24px rgba(0,0,0,.35)`. The `<em>` is white Newsreader italic 300.
- Description is 16px, lh 1.6, `rgba(255,255,255,.82)`, with a 22px gap to the buttons.

**Behaviour**
- **Entrance** (motion, `--ease-out`):
  - H1 y22→0, 0.9s.
  - Nav y−16→0, 0.8s, at 0.15s.
  - Right column y24→0, 0.9s, at 0.25s.
  - Meta bar y14→0, 0.8s, at 0.35s.
- **Background:** a slow scale from 1.02 to 1.06 over 12s on hover (desktop only).
- **Video:** the poster loads first; the video attaches in `requestIdleCallback` and pauses when the hero leaves the screen.
- **Reduced motion:** a static poster and no entrance animation.

**Remove**
- The 10-second Svayatta↔स्वयत्ता toggle, the dot field, the sticky fade/scale, the wipe line, and the `--h1-size` CSS variable hack.
- The H1 must be **real text**. Today the headline text is inside `aria-hidden` spans.

**Mobile**
- H1 `clamp(2.25rem, 10vw, 3rem)` with lh 1.02; the right column stacks below it; buttons stack at full width.
- The meta bar wraps to two lines and the follow links are hidden.

**Assets** (pick one)
- A. A Mumbai dusk photo or video (Sea Link or Marine Drive), shot or licensed.
- B. The founders at work in your space.
- C. A calm abstract night visual. The current `hero3.mp4` is fine *only if* you have the licence.

The bottom-left 55% of the frame must stay calm so the headline reads. Export a poster as AVIF ≤250KB, and the video as H.264 1080p ≤2.5MB (WebM optional).

**Files:** `components/sections/Hero.tsx` (about 120 lines), `app/page.tsx`, `public/images/hero/*`.

**Done when**
- Lighthouse mobile LCP is under 2.5s and CLS under 0.05.
- The H1 reads well at 390px.
- Both CTAs show a visible focus ring.
- Viewing the source shows the full headline text.

---

### H2. Marquee (ADD `components/sections/ValuesMarquee.tsx`, using `ui/Marquee`)

**Kawaki reference:** double marquee (A3 block 2).

**Copy**
- **Row 1 (←):** systems that *scale* • systems that *think* • systems that *last* • systems that *run themselves* •
- **Row 2 (→):** quality with *clarity* • built in *Mumbai* • made for *India* • we build, you *scale* •

**Style:** `clamp(3.25rem, 7vw, 7.5rem)`, Geist 400 ink; the `<em>` words in Newsreader italic 300 `ink-2`; bullets in `--line-strong`. Padding 72px 0 (48px on mobile), with a bottom border in `--line`.

**Behaviour:** 32s linear, rows move in opposite directions, both tracks rendered twice. Add one visually hidden sentence for screen readers ("Svayatta: systems that scale, think and last. Quality with clarity, built in Mumbai for India.").

**Reduced motion:** a single static row.

**Done when:** there's no horizontal scrollbar at any width and the loop has no visible seam.

---

### H3. Manifesto (REPLACE `FoundingPrinciples.tsx` and `WhyUs.tsx` with `components/sections/Manifesto.tsx`)

**Kawaki reference:** story / manifesto (A3 block 3).

**Layout:** a `1fr 2fr` grid with a 64px gap, stacking at ≤992px. The left side holds the H2 (`display-m`); the right side holds 3 paragraphs (`lead`) and an outline pill.

**Copy** (rewritten from your Who We Are text and the founders drawer, with the typos fixed)
- **H2:** Quality, / *with clarity.*
- **P1:** *Svayatta* is a software and AI studio from Mumbai. We build the systems underneath a business (payroll and finance tools, CRMs, AI assistants and the automations that connect them) for companies that have outgrown spreadsheets and WhatsApp groups.
- **P2:** Our name comes from <span class="deva">स्वयत्ता</span>, self-governance. That's the standard we build to: systems that run reliably on their own, so your team spends its time on the work only people can do.
- **P3:** We're founders, not a sales team. We scope honestly, ship in small steps, and stay on after launch to keep improving what we've built. We aren't the cheapest option. We aim to be the one you can rely on.
- **Button:** `Start a conversation` (outline pill → `/discovery`).

**Style:** paragraphs are 22px, weight 300, lh 1.6, ink, with 2rem between them. "Svayatta" in P1 is set as `.em`. स्वयत्ता is `.deva` in `--accent`.

**Behaviour:** paragraphs reveal one after another (0.08s stagger).

**Remove:** the scramble effect and its 3,600px scroll pin.

---

### H4. Trusted by (ADD `components/sections/ClientCells.tsx`)

**Kawaki reference:** client logo grid (A3 block 4), scaled down to what's honest for you today.

**Header:** `// Trusted by` · Teams that *run on Svayatta* · `See our work` → `/projects`.

**Grid**
- 4 cells in one row (2×2 on mobile) using `CellGrid`, aspect 4/3.
- Cells alternate night and paper: cells 1 and 3 are `--night` with white logos; cells 2 and 4 are paper with ink logos.
- **Contents, only with written permission:**
  - Aarti Enterprises
  - Growmont
  - Aarogya Clinic
  - a 4th client `[confirm]`
- **If you have only three permissions,** make cell 4 a text cell: "Your business / *next?*" linking to `/discovery`. Kawaki uses a text-only cell too ("NEXTSCHOOL ERP PLATFORM").
- **Optional second row** with product wordmarks set as text in Geist 500: CruSam · Growmont CRM · Growmont PMS · CruDoc.

**Style:** logos max 70% wide × 45% tall, monochrome (SVG `fill: currentColor`, or `filter: brightness(0) invert(1)` on night cells).

**Behaviour:** on hover, the logo scales to 1.06 and a mono caption fades up at the bottom of the cell ("CRUSAM · PAYROLL & FINANCE"). Every cell links to its product page.

**Assets:** SVG logos from each client, plus their written okay.

---

### H5. Selected work (REPLACE `CaseStudies.tsx` with `components/sections/SelectedWork.tsx`; data in `lib/work.ts`)

**Kawaki reference:** selected work (A3 block 5).

**Header:** `// Selected work` · Products *we've shipped* · `All work` → `/projects`.

**Grid:** 2 columns × 2 rows (1 column below 768px), 40px column gap, 56px row gap.

**`EditorialCard` anatomy**
1. **Media:** `MediaFrame`, 16:10. A product screenshot in a device frame on `--surface`. On hover the image scales to 1.035 and an `onImage` pill "View case study ↗" fades up bottom-right (0.3s, y6→0). The pill is hidden on touch devices.
2. **Meta line:** mono 12px, `ink-3`, with a bottom border in `--line` and 6px padding. Example: `01  ERP · PAYROLL & FINANCE ··· LIVE · 2026`. The number is ink 600; the status is a `Tag status`.
3. **Title:** `title-m`, e.g. CruSam *Payroll & finance ERP*.
4. **Description:** `small`, clamped to 2 lines.
5. **Tags:** 3 `Tag tint` chips.

**Cards** (the data lives in `lib/work.ts` and is reused by the Work hub and product pages)

**01 · CruSam**
- Category: ERP · PAYROLL & FINANCE
- Status: LIVE · AARTI ENTERPRISES
- Title: CruSam *Payroll & finance ERP*
- Description: Replaced scattered spreadsheets with one desktop platform for employee records, salary processing, invoices and vouchers, with an AI assistant built in.
- Tags: Agentic AI Assistant · Encrypted Local Storage · Self-Updating App
- Media: `public/images/Crusam_Mockups/Dashboard_MD.png`

**02 · Growmont CRM**
- Category: CRM · WEALTH MANAGEMENT
- Status: LIVE · GROWMONT
- Title: Growmont CRM *Local-first CRM*
- Description: Clients, sales and follow-ups for an advisory team, in sync across desktop and phone, and still working offline.
- Tags: Works Offline · Role-Based Access · Revenue Analytics
- Media: Growmont screenshots

**03 · Growmont PMS**
- Category: ANALYTICS · FUND RESEARCH
- Status: IN DEVELOPMENT
- Title: Growmont PMS *Fund analysis & scoring*
- Description: Fund analysis and scoring for wealth managers. `[confirm the copy]`
- Tags: `[confirm]`
- Media: design mock

**04 · CruDoc** `[confirm it's ready to show]`
- Category: HEALTHCARE · CLINIC OPERATIONS
- Status: `[LIVE / PILOT]`
- Title: CruDoc *Clinic management*
- Description: Patients, appointments and records in one app, with an AI assistant that answers calls.
- Tags: Patient Records · Appointments · AI Calls
- Media: app screenshots

**If CruDoc isn't ready:** switch to a 3-column grid, or make card 4 a text card: "Have a process that / *should run itself?*" → `/discovery`.

**Remove:** the four news cards (BMC Mumbai, Kerala Police, FTITTP, Bengaluru). If you want to keep the "AI is already here" story, turn it into an Insights post with sources.

---

### H6. Services (RESTYLE `TargetAreas.tsx` into `components/sections/ServicesGrid.tsx`; REMOVE `TargetMarkets.tsx` from home)

**Kawaki reference:** services cell grid (A3 block 7).

**Header:** `// What we build` · Services *we offer* · `All services` → `/services`.

**Grid**
- `CellGrid`, 3 columns × 2 rows (2 on tablet, 1 on mobile).
- Cells: min-height 300px, padding 36px 32px (24px 20px on mobile).

**Cell anatomy**
- **Top row:** a mono 13px number in `ink-3` and an outlined 28px `ArrowCircle`.
- **Bottom:** the title in `title-l`, then a tag line in Newsreader italic 16px `ink-3`, sentence case, separated by " · ".

**Cells**

| # | Title | Tag line | Link |
|---|---|---|---|
| 01 | Agentic AI Systems | multi-agent workflows · tool integrations · human handoff | `/services/ai-agents` |
| 02 | Conversational AI | WhatsApp · voice · booking & support | `/services/conversational-ai` |
| 03 | Machine Learning & Analytics | forecasting · document AI · dashboards | `/services/ml-analytics` |
| 04 | Custom Software & ERP | payroll & finance · CRMs · internal tools | `/services/custom-software` |
| 05 | Web & Digital Presence | websites · SEO · e-commerce | `/services/web` |
| 06 | Content & Growth Marketing | brand · video · campaigns | `/services/growth` |

"Custom Applications" is renamed "Custom Software & ERP", because that's exactly what CruSam and Growmont prove.

**Behaviour:** on hover or keyboard focus, the cell background becomes ink and the text becomes paper (tags at 75%); the ArrowCircle fills `--sky` with a `--night` icon and rotates 45°; all of this over 0.45s `--ease-out`. On touch there's no hover; the whole cell is a link.

**Remove:** the hover-revealed pain-point tags (they move to the service pages), the mouse spotlight and the glass cards.

---

### H7. How we build (REPLACE `CapabilitiesSection.tsx` with `components/sections/Process.tsx`)

**Kawaki reference:** how-we-build cards (A3 block 6).

**Header:** `// How we work` · How we *build* · `Start a project` → `/discovery`.

**Sub-bar:** `AUDIT → BLUEPRINT → BUILD → DEPLOY` (mono 13px 600, `ink-2`), 24px under the header and 40px above the cards.

**Cards:** 4 → 2 → 1 columns, 20px gap.
- `ProcessCard`: radius 16, `--line` border, padding 28px 26px, min-height 320px, a flex column with `justify-between`.
- **Top:** a chip `01 / AUDIT` (mono 11.5px 600, ls .14em, `--surface`, radius 4, padding 4px 9px), with a phase word in Newsreader italic 19px `ink-3` on the right.
- **Middle:** the title (`title-s`), then the body text (`small`).
- **Bottom:** an outcome block with a dashed top border in `--line-strong` and 14px padding above. It has a mono 11px label "OUTCOME" in `ink-3`, then 13px ink text.

**Copy** (built from your current phase text)

| Chip | Phase | Title | Body | Outcome |
|---|---|---|---|---|
| 01 / AUDIT | *Discovery* | Workflow Audit | We map how work actually moves through your business before writing any code: the tools, the edge cases, the legacy systems we have to respect. | A process map, an integration list and a scoped estimate. |
| 02 / BLUEPRINT | *Planning* | Execution Blueprint | Every touchpoint documented, sequenced and risk-rated, with the highest-impact work first. Nothing built on assumptions. | A sequenced plan with fixed milestones and a risk register. |
| 03 / BUILD | *Engineering* | Build & Testing | Built on your data and business rules, with human review at every critical step and a demo every week. | Working software on your data, reviewed every week. |
| 04 / DEPLOY | *Rollout* | Deploy & Optimise | Small, controlled releases with rollback built in, training for your team and monitoring after go-live. | A staged rollout, a trained team and ongoing support. |

**Behaviour:** on hover, the card lifts −4px, its border becomes ink and it gets the hover shadow. Cards reveal with a 0.08s stagger.

**Remove:** the sticky side nav, the 76px block titles and **the four meme images**. Delete the image files too.

---

### H8. Testimonials (KEEP the data, RESTYLE `components/sections/Testimonials.tsx`)

**Kawaki reference:** none. Kawaki has no testimonials on its home page, so this is your advantage. It's designed here to fit the system.

**Header:** `// Client voices` · In their *own words*.

**Layout (desktop):** a 2fr / 1fr grid.

**Left: the active quote**
- The quote in Geist 300 `clamp(1.6rem, 2.8vw, 2.5rem)`, lh 1.25, with its key phrase in `.em`.
- 28px below it: the name (16px 600), role · company (14px `ink-3`), and the company logo (28px tall).
- An outcome chip from your data (`Tag tint`), e.g. "24/7 · call handling".

**Right: the list of people**
- Rows with a 48px round avatar, the name and the company, separated by `--line`.
- Hover or click switches the quote. The active row gets a 2px ink left border.
- Quotes don't change on their own. Arrow keys move through the list.

**Mobile:** the quote comes first, with the people below as a horizontal scroll of chips.

**Fixes to make while restyling**
- Use one spelling of the client's name: "Aarti Enterprise" or "Aarti Enterprises" `[confirm the official name]`.
- Replace "Personal Clinic." with the real clinic name `[confirm]`.
- Lightly edit Praful Thakre's quote for grammar, only with his okay. For example: "CruSam and the new workflow make our work far more efficient. It saves us time every day and everything is easier to track."

**Consent:** get written permission from each person for their name, photo and quote. If anyone quoted has a business stake in Svayatta, say so next to the quote or feature a different client. Indian advertising guidelines expect material connections to be disclosed.

---

### H8b. Insights (ADD later; hidden until 3 posts are published)

**Kawaki reference:** journal (A3 block 8). Header: `// Notes` · Notes on *software & AI* · `All notes` → `/insights`. Three cards: an image (16:10, radius 12) with an `onImage` category tag, mono meta (date · read time), a 2-line title, a 3-line excerpt and `READ →`. Card radius 20, padding 24, with a lift on hover.

---

### H9. FAQ (ADD `components/sections/FAQ.tsx`, plus FAQPage JSON-LD)

**Kawaki reference:** FAQ (A3 block 9).

**Header:** title "Frequently / *asked*" · `Got questions?` → the WhatsApp link.

**Row anatomy (`Accordion`)**
- The question in Geist 400 `clamp(1.25rem, 2.2vw, 1.9rem)` with its key words in `.em`.
- A one-line short answer under it (15px `ink-3`).
- On the right, a 64px ink circle with ↗ (44px on mobile). When open it rotates 90° and fills `--sky`.
- The full answer in 17px `ink-2`, max-width 760px. Rows are separated by `--line`. The first item starts open.

**Questions** (draft; the bracketed items are policies only you can set)

1. **How much does a *custom system* cost?**
   - Short answer: It depends on scope. You'll get a range after one call.
   - Full answer: We price per milestone, never as an open-ended hourly bill. After the workflow audit you get a fixed scope and quote for the first version. `[confirm: optionally add "first versions typically start at ₹__"]`
2. **How long does a *project* take?**
   - Short answer: Weeks, not months, for a first version.
   - Full answer: The audit takes 1–2 weeks. A first usable version usually follows in 4–8 weeks, and then we improve it in small releases. `[confirm]`
3. **Do you work with *small businesses*?**
   - Short answer: Yes. Most of our clients are owner-run.
   - Full answer: Our software runs payroll, sales and clinic operations for teams that don't have an IT department, and we design for that.
4. **Where does *our data* live?**
   - Short answer: On your machines or your cloud, encrypted.
   - Full answer: Our products are local-first, with encrypted local storage and automatic backups (true of CruSam and Growmont today). We sign an NDA on request.
5. **Can it work in *Hindi or Marathi*?**
   - Short answer: Yes, for chat and voice assistants.
   - Full answer: We build assistants on Indian-language AI models, so your customers can talk to them in the language they use. `[confirm before publishing]`
6. **What happens *after launch*?**
   - Short answer: We stay on.
   - Full answer: Our desktop apps update themselves, we monitor what we deploy, and support plans are available. `[confirm AMC/support terms]`

**Done when:** Google's Rich Results Test validates the FAQPage JSON-LD, and the accordion works fully from the keyboard.

---

### H10. CTA band (RESTYLE `components/sections/CTA.tsx`; night version)

**Kawaki reference:** CTA band (A3 block 10). We use night to close the page the same way the hero opens it, before the white footer.

**Layout:** `--night` background, padding 140px 0 (96px on mobile), centred column.
- **Top:** a small mono `READY TO START?` in `--night-muted`.
- **Middle row:**
  - Left (≥992px): a text link `BOOK A DISCOVERY CALL →`.
  - Centre: the mega title "WE BUILD. / *YOU SCALE.*" in Geist 500 uppercase, with the second line in Newsreader italic uppercase.
  - Right (≥992px): mono `MUMBAI · REMOTE · INDIA`.
- **Bottom:** a sky pill `Start a project`, then a 12px mono line: `30-MINUTE CALL · NDA AVAILABLE ON REQUEST`.

**Remove:** the ghost "SVAYATTA" wordmark (it moves to the footer), the second button ("See how we work"), and the "45-minute" claim.

---

### F. Footer (REBUILD `components/layout/Footer.tsx`; 474 lines → about 200)

**Kawaki reference:** global footer (A2 item 8).

**Row 1:** "Quality through clarity. / *Let's get working.*" in Geist 300 `clamp(3rem, 7vw, 6.25rem)`, with the second line as `.em`. On the right, a dark pill `BOOK A DISCOVERY CALL` with a sky `ArrowCircle`.

**Row 2: four columns** (mono 11px headers, 24px gaps; 2 columns on tablet, 1 on mobile)
- **`// DIRECTORY`:** Home 01 · About 02 · Services 03 · Work 04 · Insights 05 · Book a call 06 (the number right-aligned in mono `ink-3`).
- **`// DIRECT CHANNELS`:** small uppercase labels with a value under each:
  - New projects → `info@svayatta.in ↗`
  - Founders → `sohamboridkar@svayatta.in`, `smitmhatre@svayatta.in`
  - WhatsApp → `+91 91520 35526 ↗` (one number, correctly linked)
  - Programme → a **Sarvam AI Startup Program** badge, used according to Sarvam's brand guidelines
- **`// STUDIO`:** "Mumbai, HQ" + `<LiveClock/>` (IST) + "Open 10:00–22:00 IST", the same hours as booking.
  - Show a street address only if your company secretary says the registered office must appear.
  - This replaces Kawaki's four world clocks, since your clients are in India.
- **`// SOCIAL INDEX`:** LinkedIn ↗ · Instagram ↗ (one handle) · X ↗ (only if it's active).

**Row 3:** a giant outlined "SVAYATTA" in Zaslia, full width (`font-size: 18vw`), `-webkit-text-stroke: 1px var(--line-strong)`, transparent fill, clipped at the bottom.

**Row 4: the legal bar.** `© 2026 Svayatta Intelligence Private Limited` + `CIN …` (once issued; ask your company secretary what else must be shown). Then `Privacy · Terms · Sitemap · llms.txt`, and a `Back to top ↑` pill on the right.

**Remove:** the "DZ" watermark, the duplicate Instagram handle, the giant email text and the second WhatsApp number (or label each number clearly).

---

## 7. Pages

### 7.1 `/projects`: Work hub (REPLACE)

**Kawaki reference:** case studies hub (File 1, A4).

1. **Night hero:**
   - A mono eyebrow in `--sky`: `● WORK · IN PRODUCTION`.
   - H1 (`display-l`, night-ink): "Software that's / *running today.*"
   - An intro (`body`, night-muted): "Products we've designed, built and support for real teams, from payroll to wealth management."
   - Filter pills: All · ERP & Finance · CRM · Healthcare · AI. The active pill is sky with night text; the others have a `--night-line` border and night-ink text.
2. **Paper grid:** 3 columns (2 on tablet, 1 on mobile), gap 24px. Each card has:
   - a `MediaFrame` 4:3 with a `Tag status` top-right;
   - a mono category, the title in `title-s`, and the description (`small`);
   - `Tag mono` tech chips;
   - a bottom row: `View case study →` + a mono outline button `Request a demo ↗` (or `Get access ↗` for Growmont staff).
3. **Optional "In the lab" night strip:** only for real experiments, e.g. a WhatsApp booking assistant or an Indian-language voice agent `[confirm]`.
4. **CTA:** "Have a process that / *should run itself?*" + a dark pill `Book a discovery call` + an outline pill `Explore services`.

**Implementation:** `app/projects/page.tsx` maps over `lib/work.ts`. Filtering happens client-side, with the active filter in a `?type=` query string so the URL can be shared.

### 7.2 Product case-study template: `app/projects/[slug]/page.tsx` (REBUILD from `ProjectsShowcase.tsx`)

**Kawaki reference:** case study detail (File 1, A4).

1. **Top strip:**
   - The client logo.
   - Mono categories: `ERP · PAYROLL & FINANCE · WINDOWS DESKTOP` `[confirm the platform]`.
   - On the right: `Tag status` "LIVE AT AARTI ENTERPRISES" and a mono pill `Request a demo ↗`.
2. **Title:** H1 (`display-l`) "CruSam / *Payroll that runs itself.*" plus a 2–3 sentence intro with real facts (how many employees are on payroll, what it replaced) `[confirm numbers]`.
3. **Hero shot:** 16:9 `MediaFrame`, full container width (use the existing `Dashboard_MD.png`).
4. **Chapters:** alternating image/text splits, each with a mono label, an H2 (`title-l`), a paragraph and a mono chip "DELIVERED: …".
   - `01 / THE PROBLEM`: Spreadsheets *everywhere*. Salary sheets, invoice files and vouchers lived in separate tools.
   - `02 / THE SYSTEM`: One place for *people & pay*. Employee records, salary processing, invoices & vouchers, documents, reports.
   - `03 / THE AI LAYER`: An assistant that *knows your data*. Agentic assistant, semantic search, multimodal input.
   - `04 / RELIABILITY`: Built to *keep running*. Self-updating desktop app, encrypted local storage, versioned local database, automated cloud backup, deduplicated sync, usage & cost governance.
5. **Duo grid:** 2 screenshots with captions ("Invoice creation", "Salary analytics"). Use `Invoice Creation.png` and `salaryentry-analytics.png` **with dummy data**.
6. **Outcome:**
   - The client's quote, e.g. Praful Thakre, CEO (H8 style).
   - Up to 3 stat tiles, only with real numbers `[confirm]`. Each tile is a mono label plus a Geist 300 56px number.
7. **Night conclusion:** `CASE STUDY` (mono sky) · "See CruSam / *in action.*" · a sky pill `Request a demo` + an outline `← All work`.

**Variants**
- **Growmont CRM:** the same template. The existing gated download (`GrowmontDownload.tsx`, `/api/growmont/*`) moves into the night conclusion as an email field + `Send link` (sky pill).
- **Growmont PMS:** the same template with the status "IN DEVELOPMENT", shorter chapters, and a CTA `Join the pilot` `[confirm]`.
- **CruDoc:** add it when ready.

**SEO:** each page gets `generateMetadata`, `SoftwareApplication` JSON-LD (`applicationCategory: "BusinessApplication"`, `operatingSystem`) and breadcrumbs.

### 7.3 `/about` (ADD; replaces the Founders drawer)

**Kawaki reference:** about page (File 1, A4), with two founders instead of one hero founder.

1. **Hero:** a centred H1 (`display-l`), "A software & AI studio, / *built on self-governance.*", with a 640px intro under it.
2. **Story split:** H2 "Why / <span class="deva">*स्वयत्ता*</span>". Three paragraphs: what the word means; how you started (two founders in Mumbai, building for real businesses from day one); and the standard ("systems that run on their own"). If you keep DZen (D1), this is the only place it appears, in one sentence.
3. **Founders:** two cards side by side (stacked on mobile). Each card has:
   - a 4:5 photo, radius 16;
   - a mono role tag in `--accent`, e.g. `CO-FOUNDER · ENGINEERING` `[confirm both roles]`;
   - the name in `title-l` with the surname as `.em`;
   - a 2–3 line bio;
   - email and LinkedIn text links.
4. **Principles:** 3 cards in the `ProcessCard` style, without outcomes:
   - "Clarity *before code*"
   - "Systems that *outlast us*"
   - "Partners, *not projects*"
   - Each takes two sentences from your current copy.
5. **`// WORKING WITH`:** a strip with the Sarvam AI Startup Program. Add Technovik and the Meta / WhatsApp Business Platform only if you hold that status and have permission to show the logo `[confirm]`.
6. **Company facts:** a small mono box: Svayatta Intelligence Private Limited · Mumbai, India · `[CIN once issued]`.
7. **FAQ** (3 questions), the **CTA band** and the **footer**.

Remove `AboutOverlay.tsx` and the Founders nav item.

### 7.4 `/services`: hub (ADD)

**Kawaki reference:** services hub (File 1, A4). Use your own type system, **not** Kawaki's Playfair bold.

1. **Hero:** a centred H1, "Software, AI & automation / *for how your business works.*"
2. **Grouped lists:**
   - A left label in mono, e.g. `(01) — AI & AUTOMATION`.
   - Rows: the title in Geist 400 `clamp(1.75rem, 3vw, 2.75rem)`, a short description right-aligned (14px `ink-3`, max 320px) and an `ArrowCircle`. Rows are separated by `--line`; on hover the title moves 8px to the right.
   - `(01) — AI & AUTOMATION`: Agentic AI Systems · Conversational AI · Machine Learning & Analytics
   - `(02) — SOFTWARE`: Custom Software & ERP · Web & Digital Presence
   - `(03) — GROWTH`: Content & Growth Marketing
3. **`// Where we help`:** the business functions moved from the home page, as a 3×2 `CellGrid` of smaller cells (min-height 180px), each with one example line:

   | Function | Example line |
   |---|---|
   | Finance & accounts | payroll, invoicing, vouchers |
   | Sales & GTM | CRM, follow-ups, pipeline reporting |
   | Customer engagement | WhatsApp & voice assistants, booking |
   | People & HR | records, attendance, salary |
   | Operations & logistics | inventory, approvals, workflows |
   | Business intelligence | dashboards, forecasting |

4. **CTA band** and **footer**.

### 7.5 `/services/[slug]`: detail template (ADD in phase 4; start with `custom-software` and `conversational-ai`)

**Kawaki reference:** service detail page (File 1, A4), trimmed down.

1. `Breadcrumbs`: Home / Services / Custom Software & ERP.
2. **Hero:** a centred H1, "Custom software & ERP, / *built around your workflow.*"
3. **Split intro:** an H2, two paragraphs with inline links to related services, an outline pill `Start a project`, and `Tag mono` chips. Example: Flutter · Windows desktop · Firebase/Firestore · Next.js · Sarvam AI · WhatsApp Cloud API `[confirm per service]`.
4. **`(01) — WHAT WE BUILD`:** rows built from the pain-point tags currently on your home cards (e.g. full-stack product engineering · API-first architecture · cloud-native deployment · QA automation & CI/CD), each with 1–2 sentences.
5. **`(02) — WHEN IT FITS`:** an honest comparison of when off-the-shelf software (Tally, Zoho, Google Sheets) is enough and when custom pays off. Kawaki's version of this section builds a lot of trust.
6. **`(03) — SELECTED WORK`:** 1–2 `EditorialCard`s.
7. **`(04) — HOW IT WORKS`:** the 4 process steps, compact.
8. **`(05) — STACK`:** table rows in the form `CORE 01 · App layer · description · [chip]`.
9. **`(06) — FAQ`:** all items expanded, with FAQPage schema.
10. **CTA band** and **footer**.

**Publishing rule** (from Kawaki's sitemap gate): only publish a service page once it has 300+ words of unique copy.

### 7.6 `/discovery` (RESTYLE the UI; keep `app/api/discovery` and `lib/discovery/*`)

**Kawaki reference:** contact / booking (File 1, A4).

1. **Hero:**
   - A centred `Tag tint` pill: "● 30-MINUTE DISCOVERY CALL".
   - H1: "Tell us about / *your business.*"
   - Sub-line: "Pick a time that suits you. We'll look at your current setup and tell you plainly what we'd tackle first."
2. **Booking card** on a `--surface` band: a paper card, radius 20, `--line` border, max-width 1080px, in two panels.
   - **Left panel (~38%):**
     - The logo tile and a "Discovery *call*" title.
     - Meta rows with icons: 30 minutes · Google Meet or phone `[confirm]` · Mumbai, IST.
     - "What we'll cover": 3 bullets.
     - A step box (`--surface`, radius 12): Step 1 date → Step 2 time → Step 3 details.
   - **Right panel:**
     - **Step 1:** a custom month calendar. The month title is in Newsreader italic 24px with circular prev/next buttons; past dates are disabled; the selected day is an ink circle with paper text.
     - **Step 2:** time pills in 30-minute steps from 10:00 to 22:00, labelled "Times in IST (UTC+5:30)". Slots less than 30 minutes away are disabled (the rules already in `validate.ts`).
     - **Step 3:** the details. Company name*, industry, what you do (with the 120-word counter), email*, phone. Then a dark pill `Book the call →`.
     - The success state appears inline, with the date and time shown in IST.
3. **Footer** (no CTA band on this page).

**Fixes**
- Change the copy to "You'll get an email confirmation with a calendar invite."
- Make the duration match everywhere.
- **Fix the invite timezone.** Build the event from an IST date converted to UTC explicitly, then test with a 10:00 IST booking.
- Add a consent line under the button: "By booking, you agree to our [Privacy Policy](/privacy)."

### 7.7 `/privacy` and `/terms` (ADD)

**Layout:** a long-form page at max-width 720px, `body` at 17px, H2s in `title-s`, and a mono "Last updated" date.

**Privacy policy should cover:**
- what you collect (the booking form, Growmont access emails, analytics);
- why you collect it;
- where it's processed (Resend, Vercel, Speed Insights);
- how long it's kept;
- how to contact you, and people's rights.

Have it reviewed against India's DPDP Act before publishing.

**Terms:** website use, IP, liability.

### 7.8 `/insights` (ADD in phase 4)
- **Content:** MDX in `content/insights/*.mdx`. Front-matter: title, date, category, excerpt, cover, author.
- **Hub:** H1 "Notes on *software, AI & running a business*", filter pills, and a 3-column grid.
- **Post page:**
  - Breadcrumbs, a category tag and mono meta.
  - The H1 in `display-m` and an author row.
  - A cover image (radius 16, with border).
  - Article column ~680px wide, with a "Key takeaways" box at the top.
  - A sticky sidebar with the table of contents (active item in `--accent`) and a dark CTA card.
  - Related posts at the end.
- **First three post ideas:**
  1. "How Aarti Enterprises moved payroll off spreadsheets" (with permission).
  2. "Local-first software: why your CRM should work offline."
  3. "Where AI is already working in Indian public services, and what businesses can learn from it." This reuses the news you have on the home page now, with sources.

### 7.9 404 (ADD `app/not-found.tsx`)
H1: "This page / *doesn't exist.*" Below it, three text links (Home · Work · Book a call) and the स्वयत्ता watermark.

### 7.10 `/llms.txt` (ADD `public/llms.txt`)
A plain-text summary: who you are, the services, the products with their URLs, and how to contact you. Update it whenever you add a page.

---

## 8. SEO and metadata (PR in phase 3)

**`lib/metadata.ts`**
- `title.default`: "Svayatta | Custom software, AI & automation for Indian businesses".
- `title.template`: `"%s · Svayatta"`. This fixes "Products | DZen | DZen".
- `authors`, `creator` and `publisher`: "Svayatta Intelligence Private Limited" (or "Svayatta" until incorporation completes). Set `siteName: "Svayatta"` and `locale: "en_IN"`.
- **Organization JSON-LD:**
  - `name`: the legal name; `alternateName`: "Svayatta".
  - `email`: `info@svayatta.in`; `logo`.
  - `address`: `{ addressLocality: "Mumbai", addressRegion: "MH", addressCountry: "IN" }`.
  - `sameAs`: LinkedIn and Instagram.
  - Decide whether founders' personal phone numbers stay in it.

**Page titles and descriptions**

| Route | Title | Description (≤155 characters) |
|---|---|---|
| `/` | (default) | Custom software, AI agents and workflow automation for Indian businesses, from a Mumbai studio. Scoped with you, shipped in small steps. |
| `/projects` | Work | Products in production: CruSam payroll ERP, Growmont CRM and more, built and supported by Svayatta. |
| `/projects/crusam` | CruSam: payroll & finance ERP | How CruSam replaced spreadsheets at Aarti Enterprises with one platform for records, salaries, invoices and an AI assistant. |
| `/about` | About | Svayatta is a software and AI studio from Mumbai. Meet the founders and the standard behind the name स्वयत्ता. |
| `/services` | Services | AI agents, conversational AI, custom software & ERP, analytics, web and growth, built around how your business works. |
| `/discovery` | Book a discovery call | A 30-minute call to understand your workflows and tell you plainly what we'd build first. |

**Schema by page type:** Service (services) · SoftwareApplication (products) · FAQPage (FAQ blocks) · BreadcrumbList (every inner page) · ContactPage (`/discovery`) · AboutPage + Person ×2 (`/about`) · BlogPosting (insights).

**OG images:** `app/**/opengraph-image.tsx` using `next/og`: paper background, the page H1 with its italic word, the Zaslia wordmark bottom-left, 1200×630.

**`app/sitemap.ts`:** generate it from a routes list plus `lib/work.ts` slugs (and posts later), using real `lastModified` dates.

---

## 9. Performance and accessibility targets

| Metric | Target |
|---|---|
| Lighthouse mobile | Performance ≥ 90 · Accessibility 100 · Best Practices 100 · SEO 100 |
| LCP / CLS / INP | < 2.5s / < 0.05 / < 200ms |
| JS per route | < 150KB gzipped (achievable once three/R3F/ogl/GSAP are gone) |
| Video | hero only, lazy-loaded, paused off-screen, AVIF poster |
| Images | `next/image` with `sizes`; nothing over 300KB above the fold |
| Fonts | all through `next/font` with `display: swap`; 5 families max, Devanagari only where used |
| Contrast | text ≥ 4.5:1 (the tokens in 2.1 are chosen for this); large text ≥ 3:1 |
| Keyboard | visible focus everywhere; menu focus trap; accordion and testimonial list operable by keyboard |
| Motion | `prefers-reduced-motion` respected everywhere |
| Touch | tap targets ≥ 44px; hover-only information also available on tap |

---

## 10. Content and asset checklist (for you and Smit)

- [ ] **Hero** image or video, with the rights confirmed.
- [ ] **Founder photos:** both in the same light, 4:5, shot professionally.
- [ ] **Product screenshots with dummy data:** CruSam (dashboard, invoice, salary analytics), Growmont CRM (desktop + phone), Growmont PMS (mock), CruDoc (if showing).
- [ ] **Client logos** (SVG) and **written permission** to show them.
- [ ] **Testimonial consent** (name, photo, quote) from each person, plus disclosure of any business connection.
- [ ] **Real numbers** for the case studies: employees on payroll, hours saved, records migrated.
- [ ] **Legal details:** final company name, CIN and whether the registered office must be shown (from your company secretary); privacy policy and terms text.
- [ ] **Partner badges:** Sarvam brand guidelines, and permission for any other partner logos.
- [ ] **Copy sign-off:** H1, manifesto, FAQ answers, the cost and timeline lines.
- [ ] **One** primary WhatsApp number and **one** Instagram handle.

---

## 11. Build order (section-by-section PRs)

| Phase | PR | Scope | Depends on |
|---|---|---|---|
| **1 Foundation** | 1 | Tokens, fonts, shared UI components + temporary `/styleguide` | D1–D4 locked |
| | 2 | Global shell: remove the video background and dark theme, new `globals.css` / Tailwind config | 1 |
| | 3 | Nav island + fullscreen menu + WhatsApp pill | 1 |
| | 4 | Footer | 1 |
| **2 Home** | 5 | H1 Hero | 2, hero asset |
| | 6 | H2 Marquee + H3 Manifesto | 1 |
| | 7 | H5 Selected work + `lib/work.ts` | screenshots |
| | 8 | H6 Services grid | 1 |
| | 9 | H7 Process (delete the memes) | 1 |
| | 10 | H8 Testimonials restyle | consents |
| | 11 | H9 FAQ + JSON-LD | copy sign-off |
| | 12 | H10 CTA band | 1 |
| | 13 | H4 Trusted-by cells | logos + permissions |
| **3 Pages** | 14 | `/projects` hub + `[slug]` template + CruSam page | 7 |
| | 15 | Growmont CRM / PMS moved onto the template (keep the gated download) | 14 |
| | 16 | `/about` (remove the drawer) | photos |
| | 17 | `/discovery` restyle + timezone, duration and copy fixes | 1 |
| | 18 | `/privacy`, `/terms`, 404, `llms.txt` | legal text |
| | 19 | Metadata, schema, OG images, sitemap | 14–18 |
| | 20 | Remove unused dependencies and files; Lighthouse pass | all |
| **4 Depth** | 21 | `/services` hub | 8 |
| | 22 | 2 service detail pages | 21 |
| | 23 | `/insights` + 3 posts | content |
| | 24 | Replace the WhatsApp pill with your own AI assistant | product |

**Checklist for every PR**
- Screenshots at 1440 and 390.
- A keyboard-only run through the section.
- A Lighthouse check of the affected route.
- No console or hydration errors.
- Copy proofread.
- Removed components and assets actually deleted.

---

## 12. Things we're deliberately not copying from Kawaki
- **Their exact fonts** (Instrument Serif, Plus Jakarta Sans), the lime accent and their wording ("Initial Work & Portfolio", "Crafting relevance", "Digital flagships").
- **Lime-on-white italics, and grey meta text below 4.5:1 contrast.**
- **Mixed fonts between pages** (Playfair on services, Host Grotesk on case studies). Every Svayatta page uses the same five families the same way.
- **12 unrelated services** on the home page. We show six focused ones.
- **Jargon** ("visual gravity", "zero-debt code").
- **The city-page SEO farm.**
- **The preloader, exit-intent popup and cursor glow.** Add the preloader only if you really want it: ≤500ms, skipped for crawlers and reduced motion.
- **Four world clocks.** We show one IST studio clock with our working hours, which is genuinely useful to Indian clients.
