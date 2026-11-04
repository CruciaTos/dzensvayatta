# Motion on svayatta.in: the "same box" rules

This is CruDoc's motion guideline (`Svayatta-CruDoc/CruDoc/design/motion-transitions.md`) carried over to the website. Every agent follows it.

**The idea.** When one thing leads to the next, the thing you're looking at **becomes** the next thing. Its box grows on all four sides into the next card, and what's inside it turns into the next contents at their exact places. Nothing swaps at the end. Going back is the same motion in reverse.

Tokens and maths live in `lib/motion.ts`. Don't re-type numbers: import `LEG_S`, `EASE_OUT_CUBIC`, `lerpBox`, `range` and the rest.

---

## 1. The rules (same as CruDoc)

1. **One box.** The element you start from is the box. It grows from its own rectangle to the destination card: left, right, top and bottom all move.
2. **Contents transform; they don't swap.** A title that exists in both places is drawn **once** and moves and scales from its first place to its last. Where two looks really differ (a dark pill and a white card), draw both in the same moving rectangle and cross-fade them while it moves.
3. **The last frame is the destination.** At t = 1 the moving box is exactly the destination's card: same edges, radius, padding and title position. The hand-over is invisible.
4. **Reverse = the same motion backwards.**
5. **Timing.** Tap-driven legs take **250ms**, `easeOutCubic` (`cubic-bezier(0.33, 1, 0.68, 1)`), no bounce, no overshoot. Look changes run over the middle of the motion (t 0.15 → 0.85). Scroll-driven scenes follow the scroll, with the box geometry eased by `easeOutCubic`.
6. **At rest, nothing changes.** The resting page looks exactly as it would without the motion. Keep the element tree the same shape at rest and while animating.
7. **Reduced motion turns it all off.** Everything still works, with no motion.

**Don't:**
- cross-fade two different layouts once the motion has settled;
- reveal a still page through a growing clip window;
- run longer than 250ms per tap-driven leg, or use bounce or overshoot;
- let the destination re-scroll or re-layout after the hand-over.

---

## 2. Opening from a button

If there's no matching content to transform (a button opens a panel), the button's own box grows into the panel's card while the button's label fades out. The panel's content is scaled with the box (never cut off by it) and fades in once the box is mostly open. Closing shrinks it back into the button.

**Built:** the **MENU** button grows into the fullscreen menu, and shrinks back into it on close (`components/layout/SiteMenu.tsx`).

---

## 3. Between pages

Every navigation is a view transition (`experimental.viewTransition` in `next.config.ts`; `components/motion/PageTransition.tsx`).

- **Default:** the old page fades out in 160ms and the new page rises 10px into place over 250ms.
- **The nav island and the WhatsApp pill** keep a fixed `view-transition-name` (`site-nav`, `contact-pill`). They never move and they stay above the page.
- **Shared boxes:** the clicked element and the destination card share a `view-transition-name`, so the browser grows one into the other. `components/motion/NavigationEffects.tsx` names only the clicked element, so a page with many such links never has duplicates. The name is dropped again before the new page is captured.

| You click | It grows into | Names |
|---|---|---|
| Any link to `/discovery` ("Book a call", "Book a discovery call", "Start a project"…) | The booking card | `booking-card` (set on `BookingCard`) |
| A work card linking to `/projects/<slug>` | The case-study hero media | `work-media`: put `data-vt-media` on the card's media, and `style={{ viewTransitionName: "work-media" }}` on the case-study hero media (**one per page**) |

- **Opting out:** add `data-vt-skip` to a link (or a parent) to stop it growing into the booking card.
- **Adding a new pair:** add a rule in `NavigationEffects.tsx`, a static name on the destination, and the CSS in `app/globals.css` under "Page transitions".

**Loading.** If the next page takes longer than 220ms, the nav shows the React Bits **Lattice Loader** ("Opening Work") in place of the email. The old page stays usable until the new one is ready, because React only starts the transition when the new page can commit.

---

## 4. The intro (home page, once per session)

`components/motion/IntroLoader.tsx`: the night screen flips "SVAYATTA" in letter by letter (React Bits **Split Flap Text**), then the wordmark travels into the nav and becomes the nav's own wordmark while the screen clears onto the night hero.

- **Pre-paint switch:** `lib/intro.ts` (`INTRO_SCRIPT`), inlined in `app/layout.tsx`, sets `<html data-intro>` to `run`, `move` or `done`.
- **The hero waits:** while it's `run`, the hero's entrance animations are paused by CSS.
- **Skipped for:** reduced motion, crawlers and any page other than `/`.
- **Safety:** it can never hold the page for more than 4s.

---

## 5. Between sections (scroll)

### Same box: `components/motion/SameBoxScene.tsx`

A small box at the end of one section grows into the background card ("stage") of the next as you scroll. Its title moves up into the heading. The stage ends 12px inside the viewport with 28px corners: a dark card floating on paper, for depth.

```tsx
<SameBoxScene
  source={<div>… <span data-sb-title-slot /> …</div>}  // the small box's contents
  sourceClassName="h-[230px] w-[min(640px,86vw)]"       // its size at rest
  title={em("How we *build*")}                          // drawn once, moves into…
  titleClassName="text-display-l text-night-ink"
>
  … <h2 data-sb-title className="text-display-l text-night-ink">{em("How we *build*")}</h2> …
</SameBoxScene>
```

- **Desktop only (≥1024px).** On phones, with reduced motion, or when the stage content is taller than the viewport, it renders as a plain night section with rounded corners.
- **Used on the home page:**
  - **How we build** (`Process.tsx`): a night card grows into the process stage.
  - **Closing band** (`ClosingScene.tsx`): "We build. You scale." grows into the CTA band.

### Depth: `components/motion/HeroDepth.tsx`

The hero stays pinned and settles back (a little smaller, rounded, dimmed) while the next sections slide over it as one paper sheet with rounded top corners.

### We are Svayatta: `components/sections/WeAreSvayatta.tsx`

The successor to the old "WE ARE DZEN", and the way into the manifesto ("Quality, with clarity."), which no longer has a section of its own. One pinned stage, scrubbed by the scroll so it plays backwards too:

1. **Decode.** "We", "are" and "Svayatta" decode out of Devanagari glyphs in heavy type (800, title case; "Svayatta." in Host Grotesk).
2. **Flip.** "We are" lifts away, the blurred hero footage fades in behind and "Svayatta." turns white.
3. **Fly-through.** A pure zoom into the stem of the first "t". The stem's exact left edge is measured by drawing the letter on a canvas, and the zoom's one fixed centre is chosen so that edge lands on the **split line** (40% across, md and up; the left edge of the screen on phones). The white letter becomes the page on the right; the footage beside it becomes the panel on the left.
4. **Land.** "Quality, with clarity." rises out of masks in the footage panel. The paragraphs are already in place on the white, level with the heading, and **hold still while the first one types itself out** (they're `position: sticky` for the landing's scroll distance). Then they scroll up, the next two typing as they reach the reading zone, while the panel stays pinned; then the whole split scrolls away together.

**No visible fade at the hand-off (owner, 4 Nov).** The white page side never fades: it starts at the stem's edge wherever it is and switches on in one frame, only once the letter already fills everything right of that edge, top to bottom. White replaces the same white, so nothing changes on screen. The zoom grows past the screen by 20% so this always happens before it ends.

Track: 420svh phone, 500svh desktop (the last 26% is the landing). Phones have no room for a split: the camera flies all the way into the letter and the heading and paragraphs read on the white. Reduced motion: the white word on footage, then a still split (night panel with the heading, paragraphs beside it), no pinning.

### Typewriter: `components/motion/TypeText.tsx`

The manifesto paragraphs type themselves out letter by letter on scroll (owner, 4 Nov: typewriter, not rising from below), with a caret that's solid while typing and blinks when you pause. Scrolling back un-types. A paragraph types along its own trip through the viewport, or along a `progress` value when a scene drives it (the first paragraph types along the landing). The untyped rest is laid out but hidden, so lines never reflow; Devanagari types by grapheme so clusters never break. Screen readers get the whole text; reduced motion shows it all.

### Scroll words: `components/motion/ScrollWords.tsx`

Paragraphs ink in word by word as they pass through the viewport (16% → 100% opacity). Used on /about. `*word*` is italic serif, `^word^` is Devanagari in accent.

### Everything else

`Reveal` (fade up once), hovers, and the marquee. The home page now runs three scroll scenes (We are Svayatta, How we build, the closing band) by the owner's call (4 Nov); keep other pages to two.

---

## 5b. The traversal map (owner's brief, 4 Nov: "not just vertical")

Every boundary uses a different move, so the site never feels like one long scroll.

**Home**
| Boundary | Move | File |
|---|---|---|
| Hero | The name swaps English ⇄ Marathi through a dither veil | `DitherVeilWord.tsx` |
| Hero → page | Depth: hero recedes, paper sheet slides over | `HeroDepth.tsx` |
| We are Svayatta → Manifesto | Pinned decode → blurred footage fades in → **zoom: fly through the "t" and land on the split**: the footage beside the stem becomes the heading panel, the letter becomes the white page | `WeAreSvayatta.tsx` |
| Manifesto | **Typewriter**: the first paragraph types while held still at the split, the rest type as they scroll up beside the pinned heading panel | `TypeText.tsx` |
| Services | **Flex Carousel** (React Bits): drag, flick or arrow keys; cards bend through a liquid lens; moves on by itself; poster cards drawn in the browser; click the centre card to open | `ServicesTrack.tsx`, `reactbits/FlexCarousel.tsx` |
| How we build | Same box: night card grows into the stage | `Process.tsx` |
| Client voices | **Depth: stacked cards**, earlier cards shrink and dim; cards tilt to the cursor | `ClientVoices.tsx` |
| Closing | Same box: button grows into the CTA band | `ClosingScene.tsx` |

**Services / About:** the hero **zooms out** from full screen into a floating card (`ZoomOutHero.tsx`). Services rows slide on hover with a cursor-following card and open in place (`ServicesIndex.tsx`). About: pinned स्वयत्ता with ink-in story, founders on Reflective Cards, principles on Flip Cards (`AboutSections.tsx`).

**Between pages:** the old page **sinks back** into a dimmed rounded card while the new one **zooms in** (520/620ms). Sibling product pages **swipe** left/right (`NavigationEffects.tsx` sets `<html data-vt>`; CSS in `globals.css`). Product pages end with a previous/next pager (`ProductPager.tsx`). These legs are longer than the 250ms tap rule on purpose: they are the page-to-page moments.

**Headings:** section titles rise out of a mask word by word (`MaskReveal.tsx`).

## 6. React Bits pieces in use

The copies live in `components/reactbits/`. Each keeps its licence header (MIT + Commons Clause: free to use in this site; never sell or redistribute the component itself). They use the brand fonts only (from `C:\Soham\Fonts`).

| Component | Where | Status |
|---|---|---|
| Lattice Loader | Nav page-loading indicator; "Booking…" on the booking form | Live |
| Split Flap Text | Intro wordmark | Live |
| Micro Slats | Hero background (blue on night) until real footage exists | Live |
| Dither Veil (`DitherVeilWord.tsx`, adapted) | Hero name: "SVAYATTA" (Host Grotesk 800) and "स्वयत्ता" (Marathi, in Gotu: broad-nib calligraphy, cut down to that word, `scripts/build_marathi_font.py`) swap every 3.2s. A burst from a random point sweeps across; inside its band the letters break into Bayer dither dots and pass through a sky rim. Keeps Dither Veil's dithered intro (after the site intro finishes). Timed, not pointer-driven. Pauses off screen; reduced motion shows "SVAYATTA" still | Live |
| Reflective Card | Founder cards on `/about` (mirror the site footage) | Live |
| Flip Card | Principle cards on `/about` (title front, text back) | Live |
| Logo Loop (`components/LogoLoop.tsx`) | Not used: the home "stack we build on" strip was removed (owner, 4 Nov) | Removed |
| Accordion Gallery | Screenshot gallery on case-study pages (`WorkSpotlight.tsx` is built, not placed: products stay off the home page) | Copied; Claude (case studies) |
| Scroll Expand | Case-study hero media expanding on scroll (`WorkSpotlight.tsx` is built, not placed) | Copied; Claude (case studies) |
| Masked Heading | CTA headline filled with hero footage | Later |
| Dither Veil | `/about` hero with founder photos, once photos exist | Later |
| Tech Text, Thought Line, Refine Frame, Flex Carousel, Holo Card | Not placed: they pull the look away from "clean" | Parked |

---

## 7. Checklist before calling a transition done

- [ ] The box grows on all four sides from the source to the destination card.
- [ ] Shared contents move and scale in place; any look change cross-fades within the same moving box.
- [ ] Last frame = destination at rest (compare screenshots); first frame back = destination.
- [ ] 250ms per tap leg, `easeOutCubic`, no bounce; tokens from `lib/motion.ts`.
- [ ] Reduced motion: no motion, everything still works.
- [ ] Phone width: the plain fallback looks right.
