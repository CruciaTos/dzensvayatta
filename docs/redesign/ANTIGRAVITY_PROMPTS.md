# Svayatta redesign: task split and Antigravity prompts

## Status (3 Nov 2026)

| Piece | Who | Status |
|---|---|---|
| Design tokens, fonts, 17 shared components, `/styleguide` | Claude | Done |
| Global shell: video background and old transitions removed | Claude | Done |
| Hero, CTA band, FAQ block | Claude | Done |
| `/discovery` booking card + timezone fix | Claude | Done |
| A1 content data · A2 SEO, sitemap, `llms.txt` · A3 Privacy, Terms, 404 | Antigravity | Done |
| **Fonts:** only `C:\Soham\Fonts` (Zaslia and Rozha One removed) | Claude | Done |
| **Motion system** (`docs/redesign/MOTION.md`): page transitions with shared boxes, nav lattice loader, intro, hero depth, "same box" scroll scenes, MENU→fullscreen menu | Claude | Done |
| Nav island + fullscreen menu + WhatsApp pill | Claude | Done |
| B1 Marquee, Manifesto, Process (now a "same box" scene) | Claude | Done |
| **B2** Trusted-by cells + Selected work | Antigravity | **Start now** |
| **B3** Services grid + `/services` (+ "Built with" Logo Loop) | Antigravity | **Start now** |
| **B4** Footer | Antigravity | **Start now** |
| **B5** `/about` (+ Reflective Card founders, Flip Card principles) | Antigravity | **Start now** |
| Testimonials · `/projects` hub + case-study template (Accordion Gallery, Scroll Expand, `work-media` hand-off) · home wiring · cleanup | Claude | Next |

## How to run these

1. Open this folder (`Dzen`) as the Antigravity workspace. Everything happens on the `redesign` branch, which is already checked out. **Never commit or push**: pushing deploys to Vercel.
2. **One Antigravity agent per prompt.** B2–B5 don't depend on each other, so start all four at once.
3. Keep **one** dev server running (`npm run dev` → http://localhost:3000). Agents never start their own.
4. When an agent finishes, paste its final report back to Claude. Claude wires the sections into the home page, adds the motion and checks everything in the browser.

**Changes since the first version of these prompts (they override anything older below):**
- **Fonts: only from `C:\Soham\Fonts`.** Schibsted Grotesk (`font-display`, headings), Host Grotesk (`font-sans`, body; `font-mono` = uppercase meta labels), Fraunces Italic (`font-serif`, `.em`). Wherever a prompt says "Geist", use `font-display`; "Newsreader italic" means `font-serif`. **No Zaslia, no Rozha One:** use `.deva` for स्वयत्ता.
- **Motion:** read `docs/redesign/MOTION.md`. Your sections use only `Reveal`, hovers and the marquee; Claude adds the scenes. React Bits pieces come from `components/reactbits/` only where your prompt says.
- **The root layout now also renders the intro, the page transition wrapper and the WhatsApp pill.** Still never render `<Navbar/>`, `<Footer/>` or `<main>` in a page.

---

# Wave A (done; kept for reference)

## Prompt A1: content data layer

```
You're one of several AI agents working on the Svayatta website redesign in this folder at the same time. Stack: Next.js 15 App Router, React 19, TypeScript, Tailwind 3. We're on the `redesign` branch.

Read first, in this order:
1. docs/redesign/AGENT_RULES.md (mandatory; follow it exactly)
2. types/content.ts (the TypeScript shapes you must fill; don't edit it. If a shape doesn't fit, say so in your report)
3. docs/redesign/02-svayatta-redesign-plan.md, sections 2.8, 5.2, 5.3, H5, H6, H7, H8, H9, F, 7.2, 7.3, 7.4

TASK: build the content/data layer. No UI. Pure TypeScript data that the components will import.

YOU OWN (create these, touch nothing else):
- lib/site.ts         → export const SITE: SiteConfig
- lib/nav.ts          → export const MENU_ITEMS: MenuItem[]; export const FOOTER_DIRECTORY: DirectoryLink[]
- lib/services.ts     → export const SERVICE_GROUPS: ServiceGroup[]; SERVICES: Service[]; BUSINESS_FUNCTIONS: BusinessFunction[]
- lib/work.ts         → export const WORK: WorkItem[]; export function getWork(slug: string); export function publishedWork()
- lib/process.ts      → export const PROCESS_STEPS: ProcessStep[]; PRINCIPLES: Principle[]
- lib/faq.ts          → export const HOME_FAQ: FaqItem[]; ABOUT_FAQ: FaqItem[]
- lib/testimonials.ts → export const TESTIMONIALS: Testimonial[]; export function getTestimonial(id: string)

WHERE EACH PIECE OF CONTENT COMES FROM
- SITE (plan §5.3 and §F):
  - name "Svayatta", legalName "Svayatta Intelligence Private Limited", cin null, url "https://svayatta.in", city "Mumbai", email "info@svayatta.in".
  - founders: Soham Boridkar (sohamboridkar@svayatta.in) and Smit Mhatre (smitmhatre@svayatta.in). role "Co-founder" for both, with // [confirm both roles].
  - whatsapp: display "+91 91520 35526", e164 "919152035526", href "https://wa.me/919152035526", chatHref = the link in §5.3 with the prefilled text.
  - socials: LinkedIn https://www.linkedin.com/company/dzen-svayatta/ and ONE Instagram. The current footer has two (instagram.com/wearedzen and instagram.com/dzensvayatta): use https://instagram.com/dzensvayatta with // [confirm which handle]. No X.
  - hours: open "10:00", close "22:00", timeZone "Asia/Kolkata", label "Open 10:00–22:00 IST". callMinutes 30.
- MENU_ITEMS: the numbered table in §5.2, with preview-card text from §5.2 "Right column". Insights gets hidden: true. Services gets hasServices: true and href "/services". Preview images: use real files from public/images (e.g. /images/Crusam_Mockups/Dashboard_MD.png for Work). Where no fitting image exists use "/og-image.png" and add // [asset] <what's needed>.
- FOOTER_DIRECTORY: §F "// DIRECTORY": Home /, About /about, Services /services, Work /projects, Insights /insights (hidden: true), Book a call /discovery, numbered 01–06.
- SERVICE_GROUPS + SERVICES: the 6 rows in §H6 (index, title, tagline split on " · ", slug from the link column), grouped as in the §5.2 sub-panel (ai / software / growth). summary: one plain sentence, max 90 characters, each. painPoints: copy the hover pain-point tags from today's components/sections/TargetAreas.tsx (read only) and map them onto the new six ("Custom Applications" is now "Custom Software & ERP"). href: "/services" for all (detail pages don't exist yet).
- BUSINESS_FUNCTIONS: the table in §7.4.
- WORK: 4 items. Card fields from §H5; case-study fields from §7.2.
  - CruSam (slug crusam): chapters and gallery from §7.2. headline "CruSam\n*Payroll that runs itself.*". platform "WINDOWS DESKTOP" with // [confirm].
  - Growmont CRM (slug growmont) and Growmont PMS (slug growmont-pms): build intro and chapters from what today's pages say. Read components/sections/ProjectsShowcase.tsx (GROWMONT_CRM_PROJECT and the CruSam data) and app/projects/growmont-pms/page.tsx (read only).
  - CruDoc (slug crudoc): published: false.
  - Use real image paths (list public/images first). Wherever you carry over "An unified ERP", fix it to "A unified ERP".
  - stats: [] everywhere (no real numbers are confirmed yet). testimonialId: link CruSam to Praful Thakre's testimonial.
  - cta: CruSam {label "Request a demo", kind "demo"}, Growmont CRM {"Get access", "download"}, PMS {"Join the pilot", "pilot"}, CruDoc {"Request a demo", "demo"}.
  - publishedWork() returns WORK.filter(w => w.published).
- PROCESS_STEPS: the table in §H7. PRINCIPLES: the three titles in §7.3 item 4 (keep the *asterisks*); write two plain sentences each, drawing on components/sections/AboutOverlay.tsx and WhyUs.tsx (read only; fix their typos: "gimmik", "tranditional", "Its the systems that upscales you").
- HOME_FAQ: the six questions in §H9. q keeps the italic words in *asterisks*. Where the plan has a [confirm] note, leave the bracketed part OUT of the string, set needsConfirm: true and add // [confirm] <what's missing>.
- ABOUT_FAQ: draft 3 short questions for the About page (who's behind Svayatta; where you're based and whether you work remotely; whether you sign NDAs). needsConfirm: true on each.
- TESTIMONIALS: move the data out of components/sections/Testimonials.tsx (read only, don't edit it). Ids: kebab-case names. Spell the company "Aarti Enterprises" everywhere with // [confirm official name]. Replace "Personal Clinic." with "Clinic" and // [confirm real clinic name]. Keep every quote word-for-word, but wrap its key phrase in *asterisks*. consentConfirmed: false for all. avatar/logo: the files in public/images/Testimonials.

COPY RULES: plain English, Indian/British spelling, the brand is only "Svayatta" (never DZen). Never put "[confirm]" or "TODO" inside a string that renders; use code comments and needsConfirm. Never invent client numbers or claims.

DONE WHEN:
- All 7 files exist, and every export is typed with the interfaces from types/content.ts (import type { … } from "@/types/content").
- `npx tsc --noEmit` shows no errors in your files.
- Searching your files for DZen / Dzen / DZEN finds nothing.

Then reply with the final report described in AGENT_RULES.md §7.
```

## Prompt A2: SEO library, metadata, sitemap, llms.txt

```
You're one of several AI agents working on the Svayatta website redesign in this folder at the same time. Stack: Next.js 15 App Router, React 19, TypeScript. We're on the `redesign` branch.

Read first:
1. docs/redesign/AGENT_RULES.md (mandatory; follow it exactly)
2. docs/redesign/02-svayatta-redesign-plan.md, sections 1 (D1), 7.10 and 8
3. docs/redesign/01-kawaki-design-teardown.md, section A5 (their SEO system), and B5 rows 1, 2, 8, 14, 20
4. lib/rich.tsx (you'll use plain() from it)

TASK: fix the site-wide metadata and build the SEO helpers that every page will use. Don't edit any page.tsx file; Claude wires your helpers into the pages.

YOU OWN: lib/metadata.ts (edit), lib/seo.tsx (new), app/sitemap.ts (edit), public/llms.txt (new), app/robots.ts (edit only if needed).

1. lib/metadata.ts (keep the export names siteMetadata and structuredData; the layout imports them)
   - title.default: "Svayatta | Custom software, AI & automation for Indian businesses"; title.template: "%s · Svayatta".
   - description: the "/" row of the §8 table.
   - authors / creator / publisher: "Svayatta" (comment: switch to the legal name once incorporation completes).
   - openGraph: siteName "Svayatta", locale "en_IN", type "website", matching title and description, image /og-image.png with a descriptive alt.
   - twitter: same title and description; remove `creator` (that X handle isn't used).
   - keywords: rewrite 8–10 that match the actual services (custom software India, AI agents, WhatsApp automation, payroll software, ERP, CRM, workflow automation, Mumbai software studio…).
   - Keep verification, robots and icons as they are.
   - structuredData → Organization: name "Svayatta", legalName "Svayatta Intelligence Private Limited" (// [confirm once incorporated]), url, logo, email "info@svayatta.in", address { "@type": "PostalAddress", addressLocality: "Mumbai", addressRegion: "MH", addressCountry: "IN" }, sameAs [LinkedIn https://www.linkedin.com/company/dzen-svayatta/, Instagram https://instagram.com/dzensvayatta (// [confirm handle])], founder: two Person objects with name and jobTitle "Co-founder" only. REMOVE the founders' personal phone numbers (// [confirm] add back only if the founders want them public). contactPoint email "info@svayatta.in".
2. lib/seo.tsx (new; .tsx because it exports one tiny component)
   - export const BASE_URL (same env fallback as lib/metadata.ts).
   - export const ROUTES: { path, changeFrequency, priority, lastModified }[] for /, /projects, /projects/crusam, /projects/growmont, /projects/growmont-pms, /about, /services, /discovery, /privacy, /terms. lastModified as an ISO date string ("2026-11-03" for all for now). Not /insights or /services/* yet.
   - export const PAGE_SEO: Record<string, { title?: string; description: string }>, keyed by route path, using the §8 table. Add rows the table lacks: /projects/growmont, /projects/growmont-pms, /privacy, /terms. Titles never include the brand (the template adds it). Descriptions ≤ 155 characters, plain English.
   - export function pageMetadata(path: string, overrides?: Metadata): Metadata → title, description, alternates.canonical, openGraph { title, description, url }, twitter { title, description }, merged with overrides.
   - JSON-LD builders that return plain objects:
     breadcrumbJsonLd(items: { name: string; path: string }[])
     softwareApplicationJsonLd({ name, description, slug, operatingSystem?, applicationCategory = "BusinessApplication" })
     serviceJsonLd({ name, description, slug? })  (provider = the Organization)
     faqPageJsonLd(items: { q: string; a: string }[])  (run plain() on q and a)
     contactPageJsonLd()
     aboutPageJsonLd()  (AboutPage whose mainEntity is the Organization with both founders as Person { name, jobTitle })
   - export function JsonLd({ data }: { data: object | object[] }) → <script type="application/ld+json"> with JSON.stringify(data).replace(/</g, "\\u003c").
3. app/sitemap.ts: build the list from ROUTES (BASE_URL + path, lastModified as a Date).
4. public/llms.txt (plan §7.10, llmstxt.org format): "# Svayatta", a one-line "> " summary, a short About paragraph, then ## Services (the six from §H6, one line each), ## Products (CruSam, Growmont CRM, Growmont PMS marked in development, each with its https://svayatta.in/projects/<slug> URL), ## Pages (about, services, discovery, privacy, terms), ## Contact (info@svayatta.in, WhatsApp +91 91520 35526, Mumbai, hours 10:00–22:00 IST). Plain English. No DZen.
5. app/robots.ts: make sure it allows everything and points to https://svayatta.in/sitemap.xml. Leave it alone if it already does.

DONE WHEN:
- `npx tsc --noEmit` shows no errors in your files.
- Searching your files (case-insensitive) for "dzen" finds nothing except the LinkedIn URL, which really is linkedin.com/company/dzen-svayatta.
- No title anywhere can render the brand twice.

Then reply with the final report described in AGENT_RULES.md §7.
```

## Prompt A3: Privacy, Terms, 404

```
You're one of several AI agents working on the Svayatta website redesign in this folder at the same time. Stack: Next.js 15 App Router, React 19, TypeScript, Tailwind 3. We're on the `redesign` branch.

Read first:
1. docs/redesign/AGENT_RULES.md (mandatory; follow it exactly, especially §3 tokens and §5 page conventions)
2. docs/redesign/02-svayatta-redesign-plan.md, sections 7.7 and 7.9
3. lib/rich.tsx (em() renders *italic* words)

CONTEXT: Claude is building the new light design system right now. Until it lands, the site still looks dark and some of the token classes below won't render yet. That's expected. Write against the token class names in AGENT_RULES.md §3 anyway and never hard-code colours. Pages must NOT render <Navbar/>, <Footer/> or <main>; the root layout does that.

YOU OWN: components/legal/LegalPage.tsx (new), app/privacy/page.tsx (new), app/terms/page.tsx (new), app/not-found.tsx (new).

1. components/legal/LegalPage.tsx, a shared layout for both legal pages: props { title: string; updated: string; children: ReactNode }.
   - pt-40 pb-24 (clears the fixed nav), max-w-[720px] mx-auto px-5.
   - A mono line "LAST UPDATED · 3 NOV 2026" (font-mono text-meta uppercase text-ink-3), built from `updated`.
   - H1 in text-display-m font-light text-ink.
   - Body text-body text-ink-2. Style the children with Tailwind arbitrary variants on the wrapper ([&_h2]:text-title-s [&_h2]:text-ink [&_h2]:mt-12 [&_h2]:mb-4, [&_p]:mb-5, [&_ul]:list-disc [&_ul]:pl-5, [&_a]:text-accent [&_a]:underline [&_a]:underline-offset-4). The typography plugin isn't installed and you can't add it.
2. app/privacy/page.tsx
   - export const metadata = { title: "Privacy policy", description: "…" } (no brand; the template adds " · Svayatta").
   - First read app/api/discovery/route.ts, lib/discovery/*, app/api/growmont/* and lib/growmont/* (read only) and list the fields the site ACTUALLY collects. Don't guess.
   - Cover exactly what §7.7 lists: what we collect (the discovery booking form; Growmont app access requests; Vercel Speed Insights performance data), why, who processes it (Resend for email, Vercel for hosting and Speed Insights, plus anything else you find in the code), how long it's kept, people's rights under India's Digital Personal Data Protection Act 2023 (access, correction, erasure, withdrawing consent, grievance redressal), and how to contact us (info@svayatta.in). Data fiduciary: Svayatta Intelligence Private Limited, Mumbai.
   - Policy choices only the founders can make (retention periods, grievance officer name, whether any cookies are set): write the most conservative sensible default and put a {/* [confirm] … */} JSX comment next to it.
   - Put {/* DRAFT: must be reviewed against the DPDP Act before publishing */} at the top of the returned JSX.
3. app/terms/page.tsx: website terms of use. Use of the site, intellectual property (site content and product names belong to Svayatta), site information isn't a warranty or an offer, limitation of liability, links to third-party sites, governing law India and courts of Mumbai (// [confirm]), changes to these terms, contact. Same DRAFT comment. metadata title "Terms of use".
4. app/not-found.tsx (plan §7.9)
   - Centred, min-h-[80svh], pt-40.
   - H1: em("This page\n*doesn't exist.*") in text-display-l font-light.
   - Below it, three underlined text links with a trailing →: Home (/), Work (/projects), Book a call (/discovery). Use next/link; Claude swaps in the shared TextLink later.
   - A huge faint "स्वयत्ता" watermark: className "font-deva", font-size min(30vw,260px), opacity .04, absolutely positioned bottom-centre, aria-hidden, pointer-events-none, select-none.
   - export const metadata = { title: "Page not found", robots: { index: false } }.

COPY RULES: plain English, Indian/British spelling, brand "Svayatta" only (never DZen), short paragraphs and H2 sections. Every [confirm] lives in a code comment, never in rendered text.

DONE WHEN:
- `npx tsc --noEmit` shows no errors in your files.
- /privacy, /terms and a made-up URL like /nope load on http://localhost:3000 without errors (they may look dark until Claude's theme lands; check structure, not colours).

Then reply with the final report described in AGENT_RULES.md §7.
```

---

# Wave B: B1 was done by Claude; start B2–B5 now

## Prompt B1: Marquee, Manifesto, Process (done by Claude, don't run)

```
You're one of several AI agents working on the Svayatta website redesign in this folder at the same time. Stack: Next.js 15 App Router, React 19, TypeScript, Tailwind 3, `motion` for animation. We're on the `redesign` branch.

Read first:
1. docs/redesign/AGENT_RULES.md (mandatory; follow it exactly) and docs/redesign/MOTION.md
2. docs/redesign/02-svayatta-redesign-plan.md, sections 0, 2 (design system), H2, H3, H7
3. The source of every shared component you'll use: components/ui/Section.tsx, SectionHeader.tsx, PillButton.tsx, Reveal.tsx, Marquee.tsx, ProcessCard.tsx. Read their props; don't guess.
4. lib/process.ts (PROCESS_STEPS) and lib/rich.tsx
5. Open http://localhost:3000/styleguide to see the components rendered.

TASK: build three home-page sections. Don't edit app/page.tsx (Claude wires them in) and don't delete the old sections (Claude removes them).

YOU OWN: components/sections/ValuesMarquee.tsx, components/sections/Manifesto.tsx, components/sections/Process.tsx, app/dev/b1/page.tsx (a preview page rendering your three sections in order).

SPEC (follow the plan sections exactly for copy, sizes and behaviour):
- ValuesMarquee (§H2): two Marquee rows in opposite directions, 32s. Row copy from §H2 with em() for the italic words; bullets "•" in text-line-strong. Font size clamp(3.25rem,7vw,7.5rem), Geist 400 ink; italic words via the .em class. Padding 72px 0 (48px on mobile) and a bottom border-line. Add the visually hidden sentence from §H2 (sr-only). Marquee already handles reduced motion; check its source.
- Manifesto (§H3): a Section with a grid lg:grid-cols-[1fr_2fr] gap-16 that stacks below lg. Left: H2 em("Quality,\n*with clarity.*") in text-display-m. Right: the three paragraphs from §H3 in text-lead (22px, weight 300, 2rem apart). In P1 set "Svayatta" as <em className="em">; set स्वयत्ता as <span className="deva text-accent">. Wrap each paragraph in <Reveal delay={i * 0.08}>. Then PillButton variant="outline" "Start a conversation" → /discovery.
- Process (§H7): Section → SectionHeader eyebrow "How we work", title em("How we *build*"), action { label: "Start a project", href: "/discovery" }. Then the sub-bar "AUDIT → BLUEPRINT → BUILD → DEPLOY" (font-mono, 13px, font-semibold, text-ink-2, uppercase). Then a grid of 4 → 2 → 1 columns, gap-5, of <ProcessCard> fed from PROCESS_STEPS, each in a <Reveal delay={i * 0.08}>.
- Named exports: export function ValuesMarquee(), Manifesto(), Process(). Server components unless one truly needs state.

DONE WHEN:
- `npx tsc --noEmit` shows no errors in your files.
- At http://localhost:3000/dev/b1, at 1440px and 390px wide: no horizontal scrollbar, the marquee loops with no visible seam, the cards reflow 4 → 2 → 1, and there are no console errors.

Then reply with the final report described in AGENT_RULES.md §7.
```

## Prompt B2: Trusted-by cells, Selected work

```
You're one of several AI agents working on the Svayatta website redesign in this folder at the same time. Stack: Next.js 15 App Router, React 19, TypeScript, Tailwind 3. We're on the `redesign` branch.

Read first:
1. docs/redesign/AGENT_RULES.md (mandatory; follow it exactly) and docs/redesign/MOTION.md
2. docs/redesign/02-svayatta-redesign-plan.md, sections 0, 2, 2.7 (image rules), H4, H5
3. The source of: components/ui/Section.tsx, SectionHeader.tsx, CellGrid.tsx, EditorialCard.tsx, MediaFrame.tsx, Tag.tsx, Reveal.tsx. Read their props; don't guess.
4. lib/work.ts (WORK, publishedWork), lib/testimonials.ts, lib/rich.tsx
5. Open http://localhost:3000/styleguide to see the components rendered.

TASK: build two home-page sections. Don't edit app/page.tsx (Claude wires them in) and don't delete CaseStudies.tsx (Claude removes it).

YOU OWN: components/sections/ClientCells.tsx, components/sections/SelectedWork.tsx, app/dev/b2/page.tsx (a preview page rendering both).

SPEC:
- ClientCells (§H4):
  - SectionHeader eyebrow "Trusted by", title em("Teams that *run on Svayatta*"), action { label: "See our work", href: "/projects" }.
  - CellGrid with 4 cells in one row (2×2 below lg), each aspect-[4/3]. Cells 1 and 3 are bg-night with white logos; cells 2 and 4 are paper with ink logos.
  - Cell 1: Aarti Enterprises, logo /images/Testimonials/aarti_logo.png → links to /projects/crusam. Cell 2: Growmont: there's no logo file, so set "GROWMONT" as a text wordmark (font-display, font-medium, tracking-wide) // [asset] Growmont SVG logo → /projects/growmont. Cell 3: Aarogya Clinic, logo /images/Testimonials/doctorlogo.png, no product link yet (link to /projects). Cell 4: a text cell em("Your business\n*next?*") → /discovery.
  - Every logo needs written permission: put one // [confirm] written permission to show client logos comment at the top.
  - The logos are PNGs, so make them monochrome with CSS: on paper cells `brightness-0`, on night cells `brightness-0 invert`. Max 70% wide × 45% tall, object-contain, next/image with sizes.
  - Hover/focus: logo scales to 1.06 and a mono caption fades up at the bottom of the cell (e.g. "CRUSAM · PAYROLL & FINANCE", from lib/work.ts). On touch, the caption can simply be visible.
  - Optional second row: the published product names from publishedWork() as plain text in font-display font-medium, separated by " · ".
- SelectedWork (§H5):
  - SectionHeader eyebrow "Selected work", title em("Products *we've shipped*"), action { label: "All work", href: "/projects" }.
  - Grid: 2 columns (1 below md), gap-x-10 gap-y-14.
  - Map publishedWork() to <EditorialCard>, href `/projects/${slug}`, title em(item.title), the first card's MediaFrame gets priority loading.
  - If fewer than 4 items are published, fill the last slot with a text card em("Have a process that\n*should run itself?*") → /discovery: rounded-card, border-line, bg-surface, the same height as a media card, the heading in text-title-m and an ArrowCircle.
  - Wrap each card in <Reveal delay={i * 0.08}>.
  - EditorialCard already marks its media with data-vt-media (the card's image grows into the case-study hero on click, docs/redesign/MOTION.md §3). Keep using EditorialCard so that works; don't add your own view-transition-name.

DONE WHEN:
- `npx tsc --noEmit` shows no errors in your files.
- At http://localhost:3000/dev/b2, at 1440px and 390px wide: images load, logos are legible on both cell colours, cards reflow to 1 column, everything is reachable by Tab with a visible focus ring, no console errors.

Then reply with the final report described in AGENT_RULES.md §7.
```

## Prompt B3: Services grid and the /services hub

```
You're one of several AI agents working on the Svayatta website redesign in this folder at the same time. Stack: Next.js 15 App Router, React 19, TypeScript, Tailwind 3. We're on the `redesign` branch.

Read first:
1. docs/redesign/AGENT_RULES.md (mandatory; follow it exactly) and docs/redesign/MOTION.md
2. docs/redesign/02-svayatta-redesign-plan.md, sections 0, 2, H6, 7.4, 8
3. The source of: components/ui/Section.tsx, SectionHeader.tsx, CellGrid.tsx, ArrowCircle.tsx, Reveal.tsx, components/sections/CTABand.tsx. Read their props; don't guess.
4. lib/services.ts (SERVICE_GROUPS, SERVICES, BUSINESS_FUNCTIONS), lib/seo.tsx (pageMetadata, JsonLd, breadcrumbJsonLd, serviceJsonLd), lib/rich.tsx
5. Open http://localhost:3000/styleguide to see the components rendered.

TASK: the home-page services grid and the new /services page. Don't edit app/page.tsx and don't delete TargetAreas.tsx or TargetMarkets.tsx (Claude does both).

YOU OWN: components/sections/ServicesGrid.tsx, components/sections/ServicesList.tsx, components/sections/WhereWeHelp.tsx, components/sections/BuiltWith.tsx, app/services/page.tsx.

SPEC:
- ServicesGrid (§H6), for the home page:
  - SectionHeader eyebrow "What we build", title em("Services *we offer*"), action { label: "All services", href: "/services" }.
  - CellGrid cols={3} (3 → 2 → 1). Each cell is one next/link to service.href with the `group` class; min-h-[300px], padding 36px 32px (24px 20px on mobile), flex column justify-between.
  - Top row: mono 13px index in text-ink-3 and an outlined 28px ArrowCircle. Bottom: title in text-title-l, then the tagline joined with " · " in font-serif italic 16px text-ink-3, sentence case.
  - Hover AND keyboard focus (group-hover and group-focus-visible): background → bg-ink, text → text-paper, tagline at 75% opacity, the ArrowCircle fills sky with a night icon and rotates 45°, all over duration-[450ms] ease-expo. On touch there's no hover; the whole cell is the link.
- /services page (§7.4):
  - export const metadata = pageMetadata("/services"). Render <JsonLd> with breadcrumbJsonLd([Home, Services]) and one serviceJsonLd per service.
  - Hero: centred H1 em("Software, AI & automation\n*for how your business works.*") in text-display-l, pt-40 pb-16, plus one plain intro sentence (max-w-[620px], text-ink-2).
  - ServicesList: the grouped lists. Each group has a left mono label "(01) — AI & AUTOMATION" (from SERVICE_GROUPS) and, on the right, rows: title in font-display font-normal clamp(1.75rem,3vw,2.75rem), the summary right-aligned (14px text-ink-3, max-w-[320px]) and an ArrowCircle. Rows are separated by border-line; on hover/focus the title moves 8px right (translate-x-2, duration-med ease-expo). Each row links to service.href. Stack label above rows below lg.
  - WhereWeHelp: SectionHeader eyebrow "Where we help", title em("Every part of *the business*"). Then CellGrid cols={3} of BUSINESS_FUNCTIONS, smaller cells (min-h-[180px]): title in text-title-s, example line in text-small text-ink-3.
  - BuiltWith (new file components/sections/BuiltWith.tsx, place it between WhereWeHelp and CTABand): a "// Built with" eyebrow and one row of the React Bits Logo Loop already in the repo (components/LogoLoop.tsx; read its props). Logos from the `simple-icons` package (already installed): Flutter, Dart, Firebase, Next.js, React, TypeScript, Python, in text-ink-3, ~28px tall, slow, pause on hover. Put // [confirm] the stack list next to the array. Each logo needs an accessible title.
  - Then <CTABand />.

DONE WHEN:
- `npx tsc --noEmit` shows no errors in your files.
- http://localhost:3000/services works at 1440px and 390px with no horizontal scroll and no console errors. Tab through the page: every cell and row shows the same state on focus as on hover.
- To check ServicesGrid, you may create app/dev/b3/page.tsx that renders it.

Then reply with the final report described in AGENT_RULES.md §7.
```

## Prompt B4: Footer

```
You're one of several AI agents working on the Svayatta website redesign in this folder at the same time. Stack: Next.js 15 App Router, React 19, TypeScript, Tailwind 3. We're on the `redesign` branch.

Read first:
1. docs/redesign/AGENT_RULES.md (mandatory; follow it exactly) and docs/redesign/MOTION.md
2. docs/redesign/02-svayatta-redesign-plan.md, sections 0, 2 and F (the footer spec), and docs/redesign/01-kawaki-design-teardown.md §A2 item 8 (the reference)
3. The source of: components/ui/Container.tsx, PillButton.tsx, ArrowCircle.tsx, LiveClock.tsx, Eyebrow.tsx, components/providers/SmoothScroll.tsx
4. lib/site.ts (SITE), lib/nav.ts (FOOTER_DIRECTORY), lib/rich.tsx
5. Today's components/layout/Footer.tsx (you're replacing it)

TASK: rebuild the global footer from scratch (474 lines today → about 200). It renders on every page through the root layout.

YOU OWN: components/layout/Footer.tsx (full rewrite; keep the named export `Footer`), components/layout/BackToTop.tsx (new, small client component).

SPEC (§F, exactly):
- Row 1: em("Quality through clarity.\n*Let's get working.*") in font-display font-light clamp(3rem,7vw,6.25rem), line-height ~1. On the right (below it on mobile), PillButton variant="dark" "Book a discovery call" → /discovery.
- Row 2: four columns with mono 11px headers (24px gaps; 2 columns on tablet, 1 on mobile). Give the Row 2 wrapper id="footer-contact" (the WhatsApp pill hides itself when this is on screen).
  - // DIRECTORY: FOOTER_DIRECTORY without hidden items; label on the left, index right-aligned in mono text-ink-3.
  - // DIRECT CHANNELS: small uppercase labels with a value under each: "New projects" → SITE.email (mailto) ↗; "Founders" → each founder's email; "WhatsApp" → SITE.whatsapp.display linking to SITE.whatsapp.href ↗; "Programme" → a text pill "Sarvam AI Startup Program" ({/* [asset] official badge, per Sarvam's brand guidelines */} {/* [confirm] */}).
  - // STUDIO: "Mumbai, HQ", <LiveClock />, SITE.hours.label. No street address.
  - // SOCIAL INDEX: SITE.socials, each with ↗, opening in a new tab with rel="noopener noreferrer".
- Row 3: a giant outlined "SVAYATTA": font-display font-semibold, tracking-[0.04em], font-size 17vw, transparent fill with the existing `text-stroke` utility (1px var(--line-strong)), full width, clipped at the bottom so roughly the top 70% shows, aria-hidden, select-none. (No Zaslia: fonts come only from C:\Soham\Fonts.)
- Row 4, the legal bar: "© {current year} Svayatta Intelligence Private Limited" plus " · CIN {SITE.cin}" only when SITE.cin is set; links Privacy (/privacy) · Terms (/terms) · Sitemap (/sitemap.xml) · llms.txt (/llms.txt); and on the right the BackToTop pill ("Back to top ↑"). BackToTop scrolls to the top: check SmoothScroll.tsx for a way to reach the Lenis instance and use lenis.scrollTo(0) if it exists, otherwise window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" }).
- Paper background, a border-line top border, Container widths. Footer is a server component; only BackToTop is a client component (LiveClock is already one).
- Remove everything the plan says to remove: the "DZ" watermark, the second Instagram handle, the giant email text, the second WhatsApp number.

DONE WHEN:
- `npx tsc --noEmit` shows no errors in your files.
- On http://localhost:3000 at 1440px, 768px and 390px: no horizontal scroll, the watermark is clipped cleanly, the clock ticks, Back to top works, every link has a visible focus ring, and there are no hydration warnings in the console.

Then reply with the final report described in AGENT_RULES.md §7.
```

## Prompt B5: /about page

```
You're one of several AI agents working on the Svayatta website redesign in this folder at the same time. Stack: Next.js 15 App Router, React 19, TypeScript, Tailwind 3. We're on the `redesign` branch.

Read first:
1. docs/redesign/AGENT_RULES.md (mandatory; follow it exactly) and docs/redesign/MOTION.md
2. docs/redesign/02-svayatta-redesign-plan.md, sections 0, 1 (D1), 2, 2.7, 7.3 and 8; docs/redesign/01-kawaki-design-teardown.md §A4 "About" (the reference)
3. The source of: components/ui/Section.tsx, SectionHeader.tsx, ProcessCard.tsx, MediaFrame.tsx, Tag.tsx, TextLink.tsx, Reveal.tsx, components/sections/FAQSection.tsx, components/sections/CTABand.tsx
4. lib/site.ts (SITE.founders), lib/process.ts (PRINCIPLES), lib/faq.ts (ABOUT_FAQ), lib/seo.tsx (pageMetadata, JsonLd, aboutPageJsonLd, breadcrumbJsonLd), lib/rich.tsx
5. Today's components/sections/AboutOverlay.tsx (read only; it's the founders drawer this page replaces)

TASK: build the new /about page. Don't touch AboutOverlay.tsx or the nav (Claude removes the drawer).

YOU OWN: app/about/page.tsx and a new folder components/sections/about/ (AboutHero.tsx, AboutStory.tsx, Founders.tsx, Principles.tsx, WorkingWith.tsx, CompanyFacts.tsx). Read-only: components/reactbits/ReflectiveCard.tsx and FlipCard.tsx (use them, don't edit them).

SPEC (§7.3, in this order):
1. AboutHero: centred H1 em("A software & AI studio,\n*built on self-governance.*") in text-display-l, pt-40, then a 640px-wide intro paragraph.
2. AboutStory: H2 "Why" + <span lang="hi" className="deva"> स्वयत्ता </span> (D1: don't mention DZen; add {/* [confirm] mention DZen once here, or not at all */}). Three paragraphs: what the word means (self-governance); how it started (two founders in Mumbai, building for real businesses from day one); the standard (systems that run on their own). Take the substance from AboutOverlay.tsx, fix its typos ("gimmik", "tranditional", "Its the systems that upscales you"), and don't invent dates or numbers.
3. Founders: two React Bits Reflective Cards side by side (stacked on mobile), from components/reactbits/ReflectiveCard.tsx (read its props first). Use theme="light", webcam={false} (never ask for the camera), name, role (SITE role, // [confirm]), badge "Co-founder", idLabel "EMAIL", idValue the founder's email, a gentle tilt, intro on. Size about 320×460. Under each card: a 2–3 line bio drafted from AboutOverlay.tsx and email + LinkedIn text links (omit LinkedIn if there's no URL), so everything on the card is also in plain HTML. {/* [asset] founder photos: when they exist they can go on the card */}. If the card's look clashes with the light page, tell Claude in your report instead of restyling its internals.
4. Principles: SectionHeader title em("What we *hold to*"), then 3 React Bits Flip Cards from components/reactbits/FlipCard.tsx (read its props): front = the principle title with em() in text-title-m on bg-surface, back = the body text on bg-ink with text-paper. They must flip on click, Enter and Space, and the back text must also be readable without flipping (render it again inside an sr-only element, or confirm FlipCard exposes it to screen readers). Under reduced motion, show the back text below the title instead of flipping. Same size for all three, radius 16.
5. WorkingWith: a "// Working with" strip with a "Sarvam AI Startup Program" text badge ({/* [asset] official badge per Sarvam's brand guidelines */}). No other partner logos.
6. CompanyFacts: a small mono box: Svayatta Intelligence Private Limited · Mumbai, India (CIN only if SITE.cin is set).
7. <FAQSection items={ABOUT_FAQ} />, then <CTABand />.
- export const metadata = pageMetadata("/about"); render <JsonLd> with aboutPageJsonLd() and breadcrumbJsonLd([Home, About]).
- Reveal on scroll, staggered 0.08s. Server components.

DONE WHEN:
- `npx tsc --noEmit` shows no errors in your files.
- http://localhost:3000/about works at 1440px and 390px: no horizontal scroll, one H1, headings in order, no console errors.

Then reply with the final report described in AGENT_RULES.md §7.
```
