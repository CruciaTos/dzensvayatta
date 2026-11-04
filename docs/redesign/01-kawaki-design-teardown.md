# Kawaki Studios: design teardown and notes vs svayatta.in

> **File 1 of 2.**
> - **Part A** breaks down kawaki.co.in completely: design tokens, global components, every home-page block and every inner page.
> - **Part B** compares it with svayatta.in as it is today.
> - The section-by-section change plan is in **File 2** (`02-svayatta-redesign-plan.md`).

**How this was gathered (1 Nov 2026)**
- Kawaki: the live pages, plus their public source code (github.com/gusfing/kawaki, which their own footer links to). I rendered it in a headless browser at 1440×900 (desktop) and 390×844 (mobile), and measured computed styles section by section.
- svayatta.in: the live pages, plus your repo `CruciaTos/Website-Identity-Dzen` (main @ `c026e13`, which matches what's live). I ran it locally and rendered and measured it the same way.
- Numbers marked *(computed)* were measured from the rendered page at 1440px wide.

---

## Part A: the Kawaki design book

### A0. At a glance

- **Who they are:** a Delhi-based "digital product & web studio". Their services are custom web development, Shopify, AI automation, AI search optimisation and WordPress malware removal, plus a long tail of creative services.
- **Stack:** static HTML, CSS and vanilla JS on Vercel. GSAP 3.13 + ScrollTrigger + Lenis 1.3.4 load from jsDelivr, fonts from Google Fonts, and a small Node API handles leads and the blog.
- **Their written concept** (`design.md` in the repo) is "Editorial Engineering, The Obsidian Monolith": dark obsidian glass with electric lime.
- **What actually ships is different:** a white, editorial site with one dark cinematic hero. Lime `#C6FF00` appears only as a hover/label accent, and as the italic colour on a few inner pages (About, Case Studies, Blog, Contact).
- So the doc and the live site disagree. The thing worth copying is the live home page's discipline.

**The whole look comes down to five habits**
1. A white canvas, near-black ink and almost no colour.
2. One type trick used everywhere: a light sans heading with one or two words in an italic serif ("How We *Build*").
3. One section-header pattern repeated on every block: a small `// eyebrow`, a big heading, and an outline pill button on the right.
4. Hairline 1px borders and grid cells instead of shadows, gradients or glass.
5. Small, slow motion: fade-up reveals, a 1.035× image zoom, arrows rotating 45°, and smooth scrolling.

---

### A1. Design tokens (as shipped)

#### Colour

| Role | Value | Where it's used |
|---|---|---|
| Canvas | `#FFFFFF` | almost every section |
| Alt canvas | `#F6F7F9` | alternating bands (`.forest`, `.steel`) |
| Warm neutrals | `#F4F3EF`, `#EAE8E2` (media bg), `#F7F6F2` (tag bg), `#F8F6F2` (menu card), `#FBF9F6` (booking band) | behind images, tags, the menu preview card, the contact band |
| Ink | `#111111` / `#1A1A1A` | headings, body, dark buttons |
| Secondary ink | `#444` (H2 italic), `#555` (small body), `#666` (card italic) | |
| Muted / meta | `#888`, `#AAA` (year), `#777` (CTA tag) | meta lines, eyebrows |
| Hairlines | `rgba(26,26,26,.10)`, `rgba(0,0,0,.06–.08)`; FAQ separators are a warm `rgb(214,194,194)` | grid cells, card borders |
| Dark hero | `#0A0807` + overlay `rgba(12,10,8,.5) → .25 → rgba(10,8,7,.65) → rgba(8,6,5,.92)` | home hero |
| Dark bands | `#0C0D10`, `#0A0A0C` | case-study hub hero, "Labs", case conclusion |
| Accent | lime `#C6FF00` | menu index hover, preview tag, FAQ active circle, filter pills, inner-page italics, CTAs on dark |
| Status | green dot | floating chat pill |

#### Typography

**Families**
- Plus Jakarta Sans, 300–700: the main sans.
- Instrument Serif, 400 + italic: the accent.
- Host Grotesk: the footer and some inner pages.
- Space Mono / JetBrains Mono: meta, chips and clocks.
- Playfair Display: the services pages.
- Barlow Condensed: loaded but barely used.
- The CSS sets body text to "Satoshi", which is never loaded, so it falls back to Helvetica/Arial.

| Element | Spec *(computed)* |
|---|---|
| Hero H1 | Plus Jakarta 300 · 74.9px (`clamp(2.5rem,5.2vw,5.2rem)`) · lh 1.05 · ls −0.025em · white · italic phrase in Instrument Serif 400 italic · text-shadow `0 4px 24px rgba(0,0,0,.5)` |
| Section H2 | Plus Jakarta 300 · 72px (`clamp(2.6rem,8vw,4.5rem)`) · lh 1.0 · `<em>` = Instrument Serif italic in `#444` |
| Story H2 | 50.4px · 400 · ls −0.03em |
| Story paragraph | 23.2px · weight 300 · lh 1.6 · 2.5rem between paragraphs |
| Work card title | 28.8px · 500 · ls −0.02em · serif-italic subtitle in `#666` |
| Service cell title | 40px · 400 · lh 1.0 |
| Process card title | 20px · 600 |
| Body small | 14.4–15.2px · `#555` · lh 1.55–1.6 |
| Eyebrow | "// CLIENT PARTNERS" · 13px · 700 · uppercase · ls 0.14em · `#888` |
| Meta line | 12.2px · 700 · uppercase · ls 0.12em · `#888` |
| Outline-pill label | Instrument Serif italic · 20px · uppercase · ls 1px |
| CTA mega title | 92.8px · 500 · uppercase · ls −0.03em · `<em>` serif italic, also uppercase |
| Footer CTA line | Host Grotesk 100.8px · ls −0.03em + serif italic second line |
| Mono meta | Space Mono 11.5–13px · uppercase · ls .08–.12em |

#### Layout, spacing and radius
- **Container:** `--section-width: 80vw` (92vw at ≤768px), max ~1400px. The nav is `min(92vw, 1360px)`.
- **Vertical rhythm:** `--section-padding-y: 80px` (52px on mobile). 50px from section header to content.
- **Grids:** the story is `1fr 2fr` with a 4rem gap; work is 2 columns; process 4→2→1; services 3→2→1; blog 3→2→1; logos 4→2.
- **Radius scale:** pills 999px/50px · cards 16px (work, process) and 20px (blog) · media 12–16px · number chips 4px · nav 12px.
- **Elevation:** borders, not shadows. A shadow appears only on hover: `0 16–20px 36–45px −10px rgba(0,0,0,.08)`.

#### Motion

| Behaviour | Spec |
|---|---|
| Smooth scroll | Lenis driven by the GSAP ticker (`lenis.raf(t*1000)`, `lagSmoothing(0)`) |
| Preloader | white screen, "KAWAKI / STUDIOS" (13px, 700, ls .28em), 140×1.5px bar, mono counter 00%→100% over **480ms**, .4s fade, hard dismiss at 800ms; skipped for crawlers and reduced motion |
| Hero entrance | GSAP timeline, `power4.out`: title y22→0 (.9s), nav y−20 (.8s @.15s), description y25 (.9s @.25s), meta bar y15 (.8s @.35s) |
| Hero background | scale 1.02→1.06 on hover over **12s** `cubic-bezier(.16,1,.3,1)`; video source attached in `requestIdleCallback` |
| Scroll reveal | opacity 0→1, y 28→0, **1.1s** `cubic-bezier(0.16,1,0.3,1)`; IntersectionObserver threshold .1, rootMargin −60px |
| Card hover | translateY(−5px) + border turns `#111` + soft shadow (.3–.35s) |
| Image hover | scale 1.035 (work) / 1.06 (blog) over .7s |
| Arrow icons | rotate 45° on hover (.3s) |
| Service cell hover | the whole cell flips to `#1A1A1A` with white text over .5s |
| Menu open | two full-screen layers (dark, then white) scaleY 0→1 from the top, .75s, stagger .09, `power4.inOut`; content fades up .6s; links stagger .06 |
| Marquee | 2 rows in opposite directions, **28s** linear infinite, duplicated track |
| Magnetic buttons | primary buttons follow the pointer at 0.28× the distance |
| Cursor glow | 320px radial lime at 4.5% opacity, lerp 0.14, fine pointers only |
| Reduced motion | everything is disabled under `prefers-reduced-motion: reduce` |

---

### A2. Global components (on every page)

#### 1. Preloader
Described in the motion table above. It's purely decorative and finishes in under half a second.

#### 2. Floating glass nav bar
- **Position:** fixed 24px from the top, a centred bar `min(92vw,1360px)` wide, radius 12px, padding 14px 32px.
- **Glass:** `rgba(255,255,255,.78)` + `backdrop-filter: blur(28px) saturate(190%)` + an SVG "liquid lens" displacement filter + a white highlight gradient over the top half.
- **Left:** the logo (a PNG wordmark).
- **Centre:** `HELLO@KAWAKISTUDIOS.COM ↑` (system font, 12.5px, 600, ls .16em, uppercase). On hover it turns lime and the arrow nudges.
- **Right:** `MENU` (14.4px, 600, ls .14em) with a two-bar icon (24×14, 2px bars). When open, this becomes an ✕ and the label reads `CLOSE`.
- **Scrolled > 30px:** the background goes to .92 opacity with a deeper shadow. The code also has a hide-on-scroll class.
- **Mobile:** the email is hidden, padding 10px 18px, radius 10px.
- **Note:** the MENU toggle is a `<div>`, not a `<button>`, which is an accessibility miss.

#### 3. Fullscreen menu
- **Two columns:** numbered links on the left, an info column on the right.
- **Links** (~52px, sans + serif italic, index numbers 14px grey → lime on hover):
  - `01 Home *Index*`
  - `02 About *Kawaki Studios*`
  - `03 Explore *Our Services* (+)`
  - `04 Selected *Concepts & Blueprints*`
  - `05 Blogs & *Insights*`
  - `06 Discovery *Call*`
- **Services sub-menu:** clicking (+) swaps the list in place.
  - A top bar with a `← Back to Menu` pill, a mono title "EXPLORE OUR SERVICES" and `All Services →`.
  - Groups with mono headers `// WEB & COMMERCE`, `// AI & AUTOMATION`, `// SECURITY & RECOVERY`, `// CREATIVE & SPECIALIST`.
  - Items numbered 01–09.
- **Right column:**
  - A **preview card** (110×90 image, a lime uppercase tag and a grey description) that swaps its image and text when you hover each link, driven by data attributes.
  - A dark pill `Schedule a Call ●` and the email.
  - "FOLLOW" with outline pills: LinkedIn ↗ · Twitter/X ↗ · Instagram ↗ · Behance ↗.
- **Watermark:** a giant faint italic serif "kawaki" (`min(32vw,280px)`, opacity .035) bottom-centre.
- **Behaviour:** Esc closes it and body scroll is locked. The preview card is hidden at ≤1024px.

#### 4. Floating launcher + chatbot
- **The pill:** bottom-centre and dark, with a green dot, "**Kawaki** Studios" and a square chat-icon button (lime icon).
- **The chat panel:**
  - Suggestion chips: *Start a Project · What services do you offer? · Show me your case studies · How can I contact your engineers?*
  - A lead-qualification flow (service → name → contact → details) that posts to `/api/leads` → Google Sheets + email alert.
  - Voice dictation.

#### 5. Section header (the signature element)
```
// CLIENT PARTNERS
Initial Work & Portfolio                              ( VIEW CASE STUDIES ↗ )
```
- An optional eyebrow `// …`, then an H2 in light sans (72px) with the last words in grey serif italic, and an outline pill button aligned bottom-right. It stacks at ≤640px.
- Used for: client partners, selected work, how we build, services, journal and FAQ. That's every block.

#### 6. Buttons

| Type | Look | Where |
|---|---|---|
| Outline pill (`.rlvnt-btn`) | 1px `#1A1A1A` border, pill, Instrument Serif italic uppercase 20px, black circle with a white ↗. Hover: fills black, text goes white, the icon inverts and rotates 45° | every section header |
| Solid white pill (`.vol-btn-primary`) | white bg, `#0A0A0A` 13px 700, padding 11/22. Hover: lifts −2px, a lime sheen sweeps across, press scales .96 | hero primary |
| Underlined text link | 13px, underline offset 4px, ends with "→" | hero secondary |
| Dark pill + accent circle | `#111` bg, white 15px 600 uppercase, lime circle with arrow | footer "SCHEDULE INTRO CALL", menu "Schedule a Call" |
| Outline pill + dark circle | 1.5px border, 15px 600 sans, 28px dark circle. Hover: fills dark, circle goes white and rotates | CTA band "Start a project" |
| Mono outline chip-button | Space Mono 13px, e.g. "Visit Project ↗", "Visit Live Platform ↗" | case studies |

#### 7. Tags and chips
- **Soft pill tag:** 11.5px 600, `#666` on `#F7F6F2`, 1px `rgba(0,0,0,.06)` border, padding 4/10, radius 999. Used on work cards.
- **Category pill on an image:** dark glass `rgba(17,17,17,.85)` + blur, white 11.5px 700 uppercase. Used on blog cards.
- **Number chip:** "01 / ARCHITECTURE", 12px 800, ls .16em, `#F4F4F4` bg, radius 4. Used on process cards.
- **Mono tech chip:** Space Mono 12px, 1px border, radius 100px. Used on service pages. Case cards use lime-filled category tags.

#### 8. Global footer (identical on every page)
1. **A big line:** "Ready to talk?" (Host Grotesk ~100px) / "*let's build something iconic.*" (serif italic; on inner pages "iconic." is underlined in lime). A dark pill "SCHEDULE INTRO CALL ●" sits on the right.
2. **Four columns with mono headers:**
   - `// DIRECTORY`: Home 01 · About Studio 02 · Services & Systems 03 · Case Studies 04 · Journal / Insights 05 · Discovery & Booking 06, with the numbers right-aligned in mono.
   - `// DIRECT CHANNELS`: labelled rows.
     - New Business & Inquiries → email ↗
     - Partnerships & Co-Ventures → email ↗
     - Direct Founder Calendar → "Book 15-Min Briefing ↗"
     - Infrastructure Partner → a Hostinger badge
   - `// CLIENT TIME ZONES`: live clocks in mono chips for New Delhi (Studio HQ), Tokyo, London and New York.
   - `// SOCIAL INDEX`: Instagram, X, LinkedIn, Behance and GitHub, each with ↗.
3. **A giant outlined "KAWAKI" wordmark**, stroke only, about 1px.
4. **The legal bar:** a © line, then Privacy Policy · Terms of Service · Sitemap · Robots.txt · LLMs.txt, and a "Back to Top ⌃" pill.

#### 9. Exit-intent modal (in the code)
It opens once per session when the mouse leaves through the top of the window after 300px of scrolling, and makes a discovery-call offer. It can also be opened manually with `window.openKawakiPopup()`.

---

### A3. Home page, block by block
The page is 11,419px tall at 1440px wide (15,563px on mobile).

#### 1. Hero (900px, full-bleed)
- **Content:**
  - A photo/video of a person on a hilltop with a laptop under a big sky.
  - **H1, bottom-left:** "Custom Web Development & / *Digital Products*, / Built to Last."
  - **Right column (max 440px):** a one-sentence description, a white pill "Start a Project →" and an underlined "Explore Our Work →".
  - **Bottom meta bar:** "DIGITAL PRODUCT & WEB STUDIO / NEW DELHI · GLOBAL" on the left, and "FOLLOW US · INSTAGRAM + · LINKEDIN + · TWITTER / X +" on the right.
- **Style:**
  - A dark gradient overlay over the image; the H1 is max 900px wide.
  - The meta bar has a 1px top border at `rgba(255,255,255,.14)`, a 12px blur and `rgba(10,8,7,.35)` behind it. Its text is 12px uppercase, ls .08em, at 75% white.
- **Behaviour:** the entrance timeline, the 12s background zoom and the lazy-loaded video.
- **Mobile:** the H1 becomes `clamp(2rem,9.5vw,3.2rem)` with lh .98, the columns stack and the meta bar stacks.

#### 2. Double marquee
- **Content:**
  - Row 1 (←): "we make brands *legendary* • … *timeless* • … *unforgettable* • … *relevant* •"
  - Row 2 (→): "crafted with *precision* • … *care* • … *vision* • built to *last* •"
- **Style:** `clamp(3.8rem,7.5vw,8rem)`, sans 400 + serif italic words, bullets at 25% black, padding 72px 0.
- **Behaviour:** a 28s linear loop; the duplicated track is `aria-hidden`.

#### 3. Story / manifesto
- **Content:**
  - **Left:** an H2, "Engineering / *Digital Flagships*".
  - **Right:** 4 paragraphs in order: who they serve → what they build → how they work → the outcome. The brand name is set in serif italic.
  - An outline pill "CONNECT WITH US".
- **Style:** `1fr 2fr`; paragraphs 23px / 300 / lh 1.6.
- **Behaviour:** reveal on scroll.

#### 4. Client logos
- **Content:**
  - The header "// Client Partners / Initial *Work & Portfolio*" with a pill "VIEW CASE STUDIES".
  - A **4×2 square grid**: cells 1, 3, 6 and 8 are black, the rest white.
  - One cell is just a text wordmark ("NEXTSCHOOL / ERP PLATFORM"), so not every client needs a logo file.
- **Style:** hairline cell borders; logos max 78% wide × 52% tall; 2 columns at ≤992px.
- **Behaviour:** the logo scales 1.08 on hover, and every cell links to its case study.

#### 5. Selected work
- **Content:**
  - The header "// Featured Projects / Selected *Work & Flagships*" with "ALL CASE STUDIES".
  - **2×2 editorial cards**, each with:
    - an image (16:10, radius 16, 1px border, warm bg);
    - a meta line: `01  ARCHITECTURE · DIGITAL MONOGRAPH ··· 2026`;
    - a title: "Kala Design Co. *Architecture Studio*";
    - a 2-line description and 3 soft tags.
- **Style:** the meta line is 12px 700 uppercase `#888` with a bottom hairline; the number is `#111` 800 and the year `#AAA`.
- **Behaviour:** the image zooms to 1.035, and a dark "Explore Case Study" badge fades up bottom-right.

#### 6. How we build
- **Content:**
  - The header "// Systems Methodology / How We *Build*" with "START A PROJECT".
  - A sub-bar: "STRATEGY → ARCHITECTURE → ENGINEERING → EVOLUTION".
  - **4 cards**, each with:
    - a chip "01 / ARCHITECTURE" and an italic phase word ("Discovery");
    - a title and a 3-line description;
    - a dashed divider, then "OUTCOME" + a one-line deliverable.
- **Style:** cards are radius 16, padding 32/28, min-height 340. The sub-bar is 14.7px 600 uppercase `#555`.
- **Behaviour:** cards lift −5px and the border turns `#111`.

#### 7. Services offered
- **Content:**
  - The header "Services *Offered*" with "VIEW DETAILS".
  - **12 cells** in 3 columns, with no gaps and hairline dividers.
    - Each has a number top-left and a circle-arrow top-right.
    - At the bottom: a 40px title, then tags in italic serif uppercase ("IDENTITY / POSITIONING / VOICE").
  - The last cell is "Brand Consultation / Schedule a free discovery call" and links to contact.
- **Style:** min-height 320, padding `clamp(1.5rem,2.5vw,2.5rem)`.
- **Behaviour:** the cell inverts to black and the arrow rotates 45°.

#### 8. Journal
- **Content:**
  - The header "// Journal & Insights / Editorial *Engineering Notes*" with "READ ALL STORIES".
  - **3 cards**, each with:
    - a 16:10 image with a dark category pill;
    - meta "28 SEP 2026 · 8 MIN READ";
    - a 2-line title, a 3-line excerpt and "READ ARTICLE →".
- **Style:** cards are radius 20, padding 28.
- **Behaviour:** cards lift, the image zooms to 1.06 and the arrow slides 5px.

#### 9. FAQ
- **Content:**
  - The header "Frequently / *Asked*" with "GOT QUESTIONS?".
  - **6 rows**, each with:
    - a question (~32px) with its key words in serif italic;
    - a one-line short answer in grey under the question;
    - an 80px black circle-arrow on the right.
  - The full answer opens below (18px `#444`, with italic emphasis).
- **Style:** hairline separators; the circle is 44px on mobile.
- **Behaviour:** an accordion with one item open at a time; the active circle rotates 90°.

#### 10. CTA band
- **Content:**
  - "READY TO START?" in small type above.
  - In the centre: "CRAFTING RELEVANCE / *ONE BRAND AT A TIME*" (93px uppercase).
  - A side link on the left, "SCHEDULE FREE CALL →", and mono text on the right, "GLOBALLY · REMOTE · STUDIO".
  - An outline pill "Start a project ●".
- **Style:** the side texts are hidden at ≤992px.
- **Behaviour:** the button fills and its circle rotates.

#### 11. Footer
Described in A2, item 8. The clocks are live.

#### Always visible
The floating launcher, bottom-centre, which opens the chat.

**Copy formula:** every heading is a plain phrase plus an italic qualifier ("Selected *Work & Flagships*", "How We *Build*", "Frequently *Asked*"). Every CTA is a verb: Start, Explore, Connect, View, Read, Schedule.

---

### A4. Inner pages

#### About (`/about`, 8,871px)
1. **Hero:** a centred H1 at 104px, "Full-Service Studio Delivering *Branding, Design, and Digital Growth*". The italic is lime on white, which is hard to read.
2. **Story split:** "Becoming *Brand-builders*", their origin story (started 8 years back, learning design for fun → built a studio), a philosophy paragraph and the pill "CONNECT WITH US".
3. **Logo grid:** "Initial *Work*" with "VIEW GALLERY". In the shipped source these logos are broken-image placeholders.
4. **Services grid:** the same 12 cells as the home page.
5. **Founders:** "LEADERSHIP & VISION / Founders & *Core Team*" with "WORK WITH US".
   - A **founder feature card:**
     - a photo on the left and a role tag in lime;
     - the name at 56px with the surname in lime italic;
     - a quote with a lime left rule, then a bio;
     - 3 stats: "100% BESPOKE CODE · <1.0s CORE WEB VITALS · Direct ENGINEER-LED".
   - Then 3 "practice pillar" cards, each with an image, a lime tag, a title, text and tech tags.
6. **FAQ, CTA band, footer:** the same components as the home page.

#### Services hub (`/services`, 9,915px)
1. **Hero:** a centred H1 (112px, light), "Custom Web Development, Shopify Stores & High-Performance Websites". It renders in the browser's default sans because "Satoshi" is never loaded.
2. **Story split:** "becoming *brand-builders*" with "READ OUR STORY".
3. **Five grouped lists:**
   - Each group has a small left label: "(01) — CUSTOM WEB & APPLICATIONS", "(02) — SHOPIFY & COMMERCE", "(03) — AI AUTOMATION & AI SEARCH", "(04) — WORDPRESS DEVELOPMENT", "(05) — WORDPRESS SECURITY & RECOVERY".
   - Each row is a big bold Playfair Display title (~44px) with a small right-aligned description (13px `#555`), with hairlines between rows.
   - Every row links to its service page.
4. **CTA band:** "* BUILT FOR THE FUTURE (NOW) * / HELPING *BRANDS* MOVE *THE* WORLD FORWARD", with side texts "CULTURE IN MOTION" / "IMPACT BY DESIGN" and "CONNECT NOW".
5. **Blog:** "Read our *blogs*", 3 cards and "READ MORE".
6. **Footer.**

#### Service detail (`/services/custom-web-development`, 12,041px)
This is the template for all 5 pillar pages and 9 child pages.
1. **Breadcrumb:** "HOME / SERVICES / CUSTOM WEB DEVELOPMENT" in mono 11px.
2. **Hero:** a centred H1, "Custom Web Development & / *Digital Flagship Engineering*".
3. **Split intro:**
   - An H2, "Bespoke Websites and *High-Conversion Flagships*".
   - Two paragraphs with inline links to sibling services.
   - The pill "START A WEB PROJECT", two text links to case studies, and mono tech chips (Next.js & React · TypeScript · Headless CMS · Performance-Focused · GSAP Motion · Core Web Vitals).
4. **Numbered chapters.** Each has a sticky left column (mono label like "(01) — CAPABILITIES & SCOPE", a 30px bold H2 and a short grey intro) and a right column of rows (a serif title on the left, detail and bullets on the right):
   - **(01) What We Build:** custom websites & flagships, and custom web applications, each with bulleted sub-types.
   - **Selected Work:** 4 project cards with "View Case Study →" and a mono "Visit Site ↗".
   - **(02) When Custom Development Is the Right Choice:** when existing platforms are the better answer, when bespoke work becomes essential, and how they handle migrations. This honest section builds trust.
   - **(03) Architectural Discipline:** type safety, security, data & caching and codebase, each linking to one of their own blog posts.
   - **(04) Our Development Process:** steps 01–05.
   - **(05) Supporting Technology:** table rows like `CORE 01 · Application Layer: Next.js, React & TypeScript · description · [APPLICATION LAYER]`.
   - **(06) Engineering Principles:** performance, accessibility, technical SEO and maintainability.
   - **(07) FAQ:** numbered "// 01" questions, all expanded so they're crawlable and carry FAQ schema.
5. **CTA band:** "BUILD A *DIGITAL FLAGSHIP* THAT OUTPERFORMS" with "SCHEDULE A TECHNICAL DISCOVERY CALL".
6. **Footer.**

#### Case studies hub (`/case-studies`, 6,425px)
1. **Dark hero** (`#0C0D10`):
   - A mono lime eyebrow, "● PRODUCTION PORTFOLIO · SELECTED WORK".
   - An H1 in Host Grotesk 800, white: "Engineered Platforms, *AI Products & Mobile Ecosystems*", with the italic serif in lime.
   - An intro paragraph.
   - **Filter pills:** All Disciplines (lime when active) · AI & Digital Products · Web Applications · Commerce & B2B · Brand & Marketing · Mobile Applications.
2. **White grid, 3 columns, 11 cards.** Each card has:
   - an image on top with a lime category tag top-right;
   - a mono category line, a title (23px 800) and a description;
   - mono outline tech tags;
   - a bottom row with "View Case Study →" and "Visit Project ↗" (or a disabled "Coming Soon" / "Enterprise Build").
3. **Dark "Labs" band:** "// LABS & INTERNAL R&D / Architectural Concepts & *Technical Blueprints*", with 2 concept cards linking to "Inspect Architecture Blueprint →".
4. **CTA:** "● ENGINEER WITH KAWAKI / Ready to build software with engineering credibility?", with a dark pill "Schedule Technical Discovery →" and a light pill "Explore Services Hub".
5. **Footer.**

#### Case study detail (`/case-studies/kala-design`, 8,352px)
1. **Top strip:** the client logo, mono categories ("BRAND & MARKETING WEBSITES · ARCHITECTURE / LUXURY INTERIOR DESIGN / SPATIAL CURATION") and a mono pill "Visit Live Platform ↗".
2. **Title:** an H1 at 88px 800, "Kala Design Co", over a Playfair italic line "*Engineered with Precision*". The intro uses real numbers: six years, 1.5M sq ft, 135+ clients.
3. **Hero image:** full width, radius ~16, with a soft shadow.
4. **Alternating split chapters**, each with an image (radius 12), a mono chapter label, a 51px H2, a paragraph and a mono chip "DELIVERABLE: …":
   - "01 / THE MANDATE — Distinct *Positioning*"
   - "02 / THE EXPERIENCE — The Digital *Canvas*"
   - "03 / PERFORMANCE — Engineered for *Velocity*"
   - "04 / BUSINESS IMPACT — Measurable *Gravity*"
5. **Full-bleed image** with a dark caption chip: "Kala Design Co — Production Deployment / VERIFIED INSTITUTIONAL BENCHMARK".
6. **Duo grid of screenshots** with captions ("Editorial Homepage & Masthead", "Spatial Villa Monograph & Light Studies").
7. **Dark conclusion:** "CASE STUDY CONCLUSION / Experience Kala Design Co *in Production*", with a lime "Visit Live Platform ↗" and an outline "← All Case Studies".
8. **Footer.**

#### Blog hub (`/blog`, 4,892px)
- **H1:** "Stories & ideas about *design, business* and *tech.*", with the italics in lime.
- **Filter pills:** All · Web Design and Dev · Brand Strategy · Startup Growth · Product Design · AI Visualisation · Business Growth.
- **A 3-column grid.** Each card has a row on top with the date, a category pill and "Read >", then an image (radius 12) and a 2-line title.

#### Blog post (`/blog/what-is-editorial-engineering`, 11,839px)
1. **Header:** breadcrumbs, a category pill, "7 min read · 1 Sep 2026", an H1 at 56px 800, and an author row (initials avatar, name, role).
2. **Featured image:** radius 16 with a 1px border.
3. **Two-column body:**
   - The article column (~680px, 17px text). It opens with an **"Executive Summary / Key Takeaways"** box (`#F8F9FA`, radius 16) and uses diagrams as figures with mono captions.
   - A **sticky sidebar** with a table of contents (the active item highlighted in lime), share buttons, and a dark CTA card with a lime "Schedule Call" button.
4. **Related posts:** 3 cards.
5. **Footer.**

#### Contact / booking (`/contact`, 2,651px)
1. **Hero:**
   - A centred lime pill, "● 15-MINUTE DISCOVERY SESSION".
   - An H1, "Let's build something / *that actually lasts.*", with the italic in lime.
   - A sub-line.
2. **Booking card** on a warm band (`#FBF9F6`):
   - **Left panel:**
     - A logo tile, a small lime italic "Kawaki Studios" and the title "Intro & Technical *Discovery Call*".
     - Meta rows: 15-minute 1-on-1 strategy call · Google Meet · Based in New Delhi, serving globally.
     - A description, then a step box: "Step 1: select a date / Step 2: pick a time; we'll convert it to your local time zone".
   - **Right panel:** a month calendar (serif month title, circular prev/next buttons, a weekday grid), then "Select Time (IST · UTC+5:30)" with time pills from 11:00 AM to 08:00 PM.
3. **Footer.**

#### Other routes in their source
- **Legal and utility:** Privacy Policy, Terms, 404.
- **Extra pages:** Pricing, Portfolio, Industries, Resources (guides), Solutions.
- **SEO pages:** Locations, plus about 80 city/service pages (`/mumbai/seo-company`, `/delhi/web-design-company` …).
- **Internal:** an admin dashboard.
- **For crawlers:** `llms.txt` + `llms-full.txt`, `sitemap.xml`, `robots.txt`.

---

### A5. Their SEO and information-architecture system
- **Flat structure, max 3 clicks to any page:** Home → Services hub (5 pillars → child pages) → Work → About → Insights → Contact.
- **Structured data on every page:**
  - Home: Organization + ProfessionalService + WebSite.
  - Services: Service and OfferCatalog.
  - Case studies: Article, plus Review when there's a testimonial.
  - Blog: BlogPosting + Person author.
  - FAQPage, ContactPage, and BreadcrumbList on everything below the root.
- **Internal linking rules:**
  - Every service page links to 2 case studies, 2 posts and its sibling services.
  - Every case study links to its service.
  - Every post links to 1 money page and 1 related post.
  - The footer links sitewide.
- **Sitemap quality gate:** a page only goes in if it has ≥300 words of unique copy, a unique title and description, and text that renders without JS.
- **Crawlers:** `llms.txt` for AI crawlers, and meta robots `max-image-preview:large`.

---

### A6. What not to copy from Kawaki
1. **Lime on white.** `#C6FF00` on `#FFFFFF` is a **1.19:1** contrast ratio; the italic headlines on About, Contact and Blog are close to unreadable. Their meta grey `#888` on white is **3.54:1**, which fails WCAG AA for small text.
2. **Inconsistent type between pages.**
   - Home uses Plus Jakarta + Instrument Serif.
   - Services uses Playfair Display, with headings falling back to the browser default because "Satoshi" is never loaded.
   - Case studies uses Host Grotesk 800.
   - Once you leave the home page, it feels like three different sites.
3. **Broken assets.** The About page logo grid is all broken-image placeholders.
4. **Jargon-padded copy.** Phrases like "visual gravity", "zero-debt code", "sub-1.0s Core Web Vitals" and "verified institutional benchmark" sound impressive and say little. Your buyers are accountants, clinic owners and CEOs, and they need plain language.
5. **An unfocused offer.** 12 services on the home page, including Web3/NFT, packaging and digital avatars, sitting next to malware removal. It dilutes their positioning.
6. **A city-page SEO farm.** Dozens of near-identical `/city/service` pages, which risks being treated as thin content.
7. **Preloader, exit-intent popup and cursor glow.** These are decoration that delays or interrupts. You can skip them.
8. **Generic AI imagery.** The hero and blog art say nothing specific; credibility comes from real work.

---

## Part B: notes compared to svayatta.in

### B1. svayatta.in today: inventory
- **Stack:**
  - Next.js 15 (App Router) + React 19.
  - Tailwind 3 + shadcn tokens.
  - `motion` (Framer Motion), GSAP, Lenis.
  - three.js + @react-three/fiber + postprocessing + ogl (WebGL) in `package.json`.
  - Resend for booking emails, hosted on Vercel.
- **Theme:** dark navy `#000B12`, text `#E5F3E5`, sky-blue accent `#7EC3E2` / `#B2D5E5`. A **global fullscreen video background** (`hero3.mp4`, blue petals) sits behind every page.
- **Fonts:**
  - Geist: every heading and all body text, mostly at weight 700.
  - DM Serif Display: loaded but barely used.
  - IBM Plex Mono: eyebrows and the nav.
  - Zaslia: the wordmark and the hero.
  - Rozha One: Devanagari.
- **Pages:**
  - `/` is one long page with anchor links.
  - `/projects` (CruSam), `/projects/growmont` (Growmont CRM, with a gated download), `/projects/growmont-pms` (in development).
  - `/discovery` (the booking form).
  - Founders lives in a **slide-in drawer**, not a page.
  - There are no About, Services, Work-hub, Blog, Privacy or Terms pages.

#### Home sections in order (14,682px at 1440)

1. **Nav**
   - Logo, then PLATFORM · SERVICES · METHODOLOGY · PRODUCTS ▾ · CONTACT · FOUNDERS with a scroll-spy pill, and a "GET STARTED →" pill.
   - It's a full-width bar that becomes a floating glass pill when you scroll.
2. **Hero** (sticky)
   - The eyebrow "WE BUILD·YOU SCALE".
   - A giant "Svayatta" ↔ "स्वयत्ता" that toggles every 10s.
   - A paragraph, then "REQUEST A DISCOVERY CALL" and "SEE WHAT WE BUILD →", over an interactive dot field.
   - It fades and scales away as the next section slides over it.
3. **"Think AI is still far away? *It's already happening.*"**
   - A marquee of 4 expanding news cards: BMC Mumbai ₹19.25 Cr, Kerala Police CSAM tracking, airport biometrics, and the Bengaluru challan billboard.
4. **"WE ARE DZEN."**
   - A full-screen scroll-scramble word reveal taking about 3,600px of scroll.
5. **"Business Functions We Transform"**
   - 6 spotlight cards with titles only: Financial Operations, GTM Support, Customer Engagements, People & Talent Management, Operations & Logistics, Business Intelligence.
6. **"Our Expertise"**
   - 6 cards: Agentic AI Systems, Machine Learning & Analytics, Custom Applications, Conversational AI, Web & Digital Presence, Content & Growth Marketing.
   - Each has a description, and 4 pain-point tags that appear on hover.
7. **Execution path**
   - A sticky side nav (AUDIT / BLUEPRINT / BUILD / DEPLOY) next to 4 big alternating blocks.
   - **Each block is illustrated with a meme photo:**
     - Big Bird in a meeting;
     - a thumbs-up guy in an office buried in paper;
     - a man with blurred extra arms working four laptops;
     - a thumbs-up guy with someone screaming behind him.
8. **"Don't Take Our Word For It"**
   - A testimonial carousel with avatar thumbnails:
     - Bharat Boridkar, Aarti Enterprise;
     - Praful Thakre, CEO, Aarti Enterprise;
     - Dr. Rutuja Nilgunkar, "Personal Clinic.";
     - Dr. Neeta Save, Aarogya Clinic.
9. **"Who We Are / We Build·You Scale. / QUALITY IS CLARITY. CLARITY IS GROWTH."**
   - Three quoted manifesto paragraphs with a scroll highlight, then "START A CONVERSATION →".
10. **CTA: "Ready to see what *we'd build for you?*"**
    - Copy about a "45-minute" call, "SCHEDULE A DISCOVERY CALL →", "SEE HOW WE WORK →" and "· NDA AVAILABLE ON REQUEST".
    - A ghost "SVAYATTA" wordmark behind it.
11. **Footer**
    - "LET'S TALK / Quality through Clarity / Let's get *working.*"
    - LinkedIn and **two** Instagram handles.
    - A huge info@svayatta.in, two WhatsApp numbers and an outlined "DZ" watermark.
    - "© 2026 Svayatta Intelligence".

---

### B2. Side by side

| Dimension | Kawaki | svayatta.in now | Gap to close |
|---|---|---|---|
| Canvas | White, ink, hairlines | Dark navy + video background + glass cards + grid textures + glows | Too many layers; move to a calm canvas |
| Type system | 1 light sans + 1 italic serif accent + mono meta, used the same way everywhere | Geist at weight 700 everywhere; the serif is loaded but unused | Add the light-sans + italic-serif pairing and lighter weights |
| Section headers | One identical header on every block | Every section invents its own | Build one `SectionHeader` |
| Hero | The H1 says what they do; one image; 2 CTAs; a meta bar | The H1 is only the brand name; the message is buried in the paragraph | Put the offer in the H1 |
| Proof | Their own client logos and case studies | Other organisations' AI news, plus memes | Lead with CruSam, Growmont and your clients |
| Process | 4 clean cards, each with an "Outcome" | 4 huge blocks with memes | Cards with outcomes |
| Services | A 3-column cell grid that inverts on hover; each cell links to a page | 6 cards with hover tags, no links | A cell grid with links to service pages |
| Pages | Home, About, Services (+ detail), Work (+ detail), Blog, Contact, Privacy, Terms | Home, Products ×3, Discovery | Add About, Services, a Work hub, Privacy, Terms |
| Navigation | A minimal bar + fullscreen menu | 6 links + a dropdown + a CTA | Bar + fullscreen menu |
| Footer | Big CTA + directory + labelled channels + clocks + social + legal | CTA + socials + email/phones | Add the directory, legal links and labelled channels |
| Motion | Small and slow | Sticky pins, a scramble effect, slide-overs, WebGL dots, background video | Cut down to reveals, hovers and the marquee |
| SEO | Schema on every page, FAQ schema, breadcrumbs, llms.txt | One Organization schema; 3 URLs in the sitemap | Per-page metadata and schema |
| Brand name | One name | Svayatta / SVAYATTA / DZen / DZEN / Dzen Svayatta / DZen, Inc. / DZenSvayatta / Svayatta Intelligence | Pick one |

---

### B3. Block-by-block mapping (Kawaki → yours → what to do)

| Kawaki block | svayatta.in now | Action |
|---|---|---|
| Glass nav bar + fullscreen menu | 6-link nav + Products dropdown + Founders drawer | **Replace** |
| Cinematic hero + meta bar | Toggling "Svayatta/स्वयत्ता" hero + dot field | **Replace** (keep स्वयत्ता as a detail) |
| Double marquee | — | **Add**, with your own lines |
| Story / manifesto | "WE ARE DZEN." scramble + "Who We Are" paragraphs | **Replace and merge** |
| Client logo grid | — (logos only appear inside testimonials) | **Add** (smaller, and honest) |
| Selected work cards | The "Think AI is still far away?" news marquee; products only on `/projects` | **Replace** with your products |
| How we build cards | Execution path with memes | **Replace** |
| Services cell grid | "Our Expertise" cards | **Restyle** |
| — | "Business Functions We Transform" | **Move** to the Services page |
| — (Kawaki has no home testimonials) | Testimonial carousel | **Keep and restyle**. This is an advantage you have. |
| Journal | — | **Add later** |
| FAQ | — | **Add** |
| CTA band | "Ready to see what we'd build for you?" | **Restyle** |
| Footer | Footer | **Rebuild** |
| Floating chat pill | — | **Add** as a WhatsApp pill |
| About page | Founders drawer | **Add a page** |
| Services hub + detail pages | — | **Add** |
| Case-study hub + detail pages | The `/projects` pages | **Rebuild** as a Work hub + product pages |
| Contact booking card | `/discovery` form | **Restyle** |
| Privacy / Terms | — | **Add** |

---

### B4. What you have that Kawaki doesn't (keep these)
- **Real products running at real clients.** CruSam is at Aarti Enterprises and Growmont CRM is at Growmont, and you have named testimonials, including one from a CEO. Kawaki's home page has no testimonials at all.
- **A real identity hook.** स्वयत्ता means self-governance, and it works in both Devanagari and English. Nothing like it exists on Kawaki.
- **A working booking backend.** It already has validation, rate limiting, an ICS invite and a team notification. You also have a gated product download flow (Growmont).
- **Lines that already work:** "We Build · You Scale", "Quality with Clarity", "Let's get working."
- **Next.js App Router.** New pages, per-page metadata, generated OG images and MDX posts are much cheaper for you than for Kawaki's hand-written static HTML.

---

### B5. Problems found on svayatta.in (fix them during the redesign)

| # | Issue | Where | Fix |
|---|---|---|---|
| 1 | The brand name is written eight different ways | nav, hero, "WE ARE DZEN.", the footer "DZ", and `lib/metadata.ts` (authors "DZen, Inc.", siteName "DZen", schema name "DZenSvayatta") | Pick one brand (decision D1 in File 2) |
| 2 | Page titles repeat the brand: "Products \| DZen \| DZen", "Request a Discovery Call \| DZen \| DZen" | `title.template` + page titles | Template `%s · Svayatta`; page titles without the brand |
| 3 | Meme photos used as section art | `public/images/workflow.jpeg`, `blueprint.jpeg`, `build.jpeg`, `deploy.jpeg` (used in `CapabilitiesSection.tsx`) | Remove them |
| 4 | The WhatsApp links have no country code | Footer: `wa.me/9152035526`, `wa.me/9152035527` | `https://wa.me/919152035526` |
| 5 | The CTA promises a **45-minute** call, but the invite length defaults to **30** | `CTA.tsx` vs `CALENDAR_EVENT_DURATION_MINUTES` (default 30 unless set in Vercel) | Pick one length and use it everywhere |
| 6 | The form promises a "Gmail confirmation + Google Calendar invite", but it actually sends an `.ics` attachment by email through Resend | `DiscoveryForm.tsx` (~line 379) | Change the copy to "You'll get an email confirmation with a calendar invite." |
| 7 | The invite time is built without a timezone. On a UTC server, a 10:00 IST slot could arrive as 15:30 IST | `lib/discovery/schedule.ts` (`createEvent` start array) | **Check with a test booking**; then convert IST → UTC explicitly before building the event |
| 8 | The schema email is `hello@svayatta.in` but the site uses `info@svayatta.in`; founders' personal phone numbers are in the public JSON-LD | `structuredData` in `lib/metadata.ts` | Use `info@`; decide whether personal numbers should be there at all |
| 9 | The Products page meta description mentions CruDoc, but the page doesn't show it | `app/projects/page.tsx` metadata | Align them |
| 10 | "An unified ERP" | CruSam tagline | "A unified ERP" |
| 11 | Image alt text "Slide 1"; a generic logo alt | `ProjectsShowcase.tsx` | Write descriptive alt text |
| 12 | Founders exist only in a drawer, so Google can't index it and nobody can link to it | `AboutOverlay.tsx` | Make an `/about` page |
| 13 | No privacy policy or terms, even though the form collects email and phone | — | Add both, plus a consent line under the form |
| 14 | Two Instagram handles, and an X handle in the metadata that's never linked | Footer / metadata | Consolidate |
| 15 | The H1 is only the brand name, so the main heading says nothing about what you do | `Hero.tsx` | Put the offer in the H1 |
| 16 | The social proof is other organisations' news, and two of the items (CSAM tracking, a public-shaming billboard) are heavy for a home page | `CaseStudies.tsx` | Replace with your own work; the stats can live in an Insights article with sources |
| 17 | `hero3.mp4` looks like a phone live wallpaper | `public/videos` | Confirm you have the rights, or replace it |
| 18 | A heavy bundle: three.js, R3F, postprocessing, ogl, GSAP and motion are all in `package.json`, plus a video on every page | `package.json`, `GlobalVideoBackground` | Remove whatever the new design doesn't use |
| 19 | Typos in the founders copy ("gimmik", "tranditional", "Its the systems that upscales you") | `AboutOverlay.tsx` | Fix them when you write the /about copy |
| 20 | The sitemap lists only 3 URLs; the Growmont pages are missing | `app/sitemap.ts` | Generate it from your list of routes |
| 21 | "GET STARTED" is a button that calls `router.push`, not a link | `Navbar.tsx` | Use an `<a href="/discovery">` (crawlable, opens in a new tab with a modifier key) |
| 22 | "Aarti Enterprise" in testimonials vs "Aarti Enterprises" on Products; "Personal Clinic." has a stray full stop | `Testimonials.tsx` | Use the client's official name |
