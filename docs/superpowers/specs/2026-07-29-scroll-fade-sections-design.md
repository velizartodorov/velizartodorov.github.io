# Scroll fade sections & timeline redesign

## Problem

Each top-level page section (Introduction, Employments, Licenses & certifications,
Presentations, Languages, Education) is currently wrapped in `AccordionWrapper`
(`src/components/common/accordion_wrapper.tsx`), a collapsible card with a header button and
chevron that toggles the section's content open/closed.

Now that the page has a sticky `Nav` (`src/components/nav/nav.tsx`) with scrollspy
(`useActiveSection`) and click-to-scroll behavior, the per-section collapse/expand toggle is
redundant — the nav already handles moving between sections. The boxed/card chrome
(gray header bar, border, drop-shadow, chevron) was purpose-built for that collapsible
interaction and no longer fits once the toggle is removed.

Additionally, within Employments and Education, each row is its own click-to-expand
`AccordionItem` (`src/components/common/accordion.tsx`), and within Licenses & certifications,
institutions with more than one certification are grouped the same way (institutions with
exactly one certification instead render as a plain row via `DividedList`). This accordion
click-to-reveal pattern has the same problem as the outer one, and additionally hides
information behind a click for entries that can be long (e.g. the "CVO Groeipunt" institution
has 18 certifications, all currently hidden until its row is clicked open).

## Goals

- Remove the per-section collapse/expand toggle entirely. Sections are always fully rendered
  (no hidden content, no `aria-expanded` state).
- Replace the boxed/card look with a lighter, borderless style — a heading (icon + title) plus
  content, relying on spacing and the fade effect itself for visual separation between sections.
- As the user scrolls, each section gradually fades in as it enters the viewport and fades back
  out as it leaves — a continuous crossfade tied to scroll position, not a discrete one-time
  reveal. A section is only ever at full opacity while comfortably inside the viewport.
- Replace the inner per-item accordions in Employments, Education, and Licenses &
  certifications with a shared **timeline** presentation: a vertical rail with one marker per
  entry (the entry's logo/icon doubles as the marker), always fully rendered — no click-to-expand
  anywhere. Clicking a marker smooth-scrolls to that entry; the marker for whichever entry is
  currently in view is highlighted, independent of clicking.
- Within a timeline entry, nested content (an employment's individual positions when a company
  has more than one, e.g. Unified Post/ADM Solutions; an institution's individual certifications
  in Licenses & certifications, e.g. CVO Groeipunt's 18 certificates) is **not** truncated or
  gated behind a "read more" click either. Each nested row is its own independent scroll-fade
  unit — it fades in as it scrolls into view and fades out as it scrolls past, exactly like the
  outer section fade, just applied at finer granularity. Every row physically exists in the
  layout at all times; fading is the only thing gating its visibility.
- Rename the "Home" nav item to "Introduction 👋" (matching the Introduction section's own
  heading and emoji, consistent with every other nav item already showing its section's emoji).
- Licenses & certifications no longer distinguishes "grouped" (>1 certification) vs "single" (1
  certification) institutions — every institution becomes one uniform timeline entry, whether it
  has 1 certification or 18.

## Non-goals

- No change to `Nav`'s click-to-scroll/scrollspy mechanics, section routing
  (`src/app/sections.ts`, `/[section]/page.tsx`), or the Presentations/Languages sections (they
  were already plain `DividedList` rows, not accordions — unaffected other than living inside the
  new borderless `Section`).
- No pure-CSS (`animation-timeline: view()`) implementation, for either the section-level or
  row-level fade. The project's production browserslist (`>0.2%, not dead, not op_mini all`)
  includes browser versions that don't support CSS scroll-driven animations; a CSS-only approach
  would silently show no animation for a meaningful slice of visitors. Approach rejected in favor
  of a JS-driven approach (`useScrollFade`, below) that behaves consistently across the whole
  target matrix.

## Design

### 1. Visual structure — `Section` component

A new component, `src/components/common/section.tsx`, replaces `AccordionWrapper`:

- No border, background card, drop-shadow, header button, or chevron.
- Renders a heading (same icon + title, same responsive
  `text-[clamp(0.6rem,-1rem+9vw,1.5rem)]` sizing as today) followed by `children`.
- Preserves `id` and `scroll-mt-*` on the section's root element, since `Nav`'s click-to-scroll
  and `useActiveSection`'s scrollspy both target these section IDs directly and must keep
  working unchanged.
- Spacing between sections (replacing the card boundary as the visual separator) is done with
  Tailwind utility classes (e.g. vertical padding/gap) — no new CSS files or CSS Modules classes,
  consistent with how the rest of the codebase already styles exclusively via Tailwind
  (including arbitrary-value utilities like `text-[clamp(...)]`).

`App.tsx`'s `PageContent` swaps every `AccordionWrapper` usage for `Section`.

### 2. Fade mechanic — `useScrollFade` hook

A new hook, `src/components/common/use_scroll_fade.ts`, taking a ref to an arbitrary element.
It's applied to two different kinds of targets: whole `Section` roots, and individual nested
rows inside a timeline entry (a position row, a certificate row) — same hook, same behavior,
different mount points.

**Why not plain `IntersectionObserver` ratio alone:** `intersectionRatio` is
intersecting-area ÷ target-total-area. Several sections (e.g. Employments) are taller than the
viewport, so their ratio never approaches 1 even when comfortably centered on screen — using
raw ratio as opacity would leave tall sections permanently semi-transparent. Opacity instead
needs to be derived from where the target's top/bottom *edges* sit relative to the viewport, not
from intersecting area. The same reasoning applies to short nested rows too, for consistency of
mechanism (and because a row can also be taller than the entry/viewport in edge cases, e.g. a
long certificate name wrapping on narrow viewports).

**Mechanism:**

- A single shared `IntersectionObserver` per element using the hook, with a generous
  `rootMargin` (e.g. `100% 0px 100% 0px`) and `threshold: 0`, acts purely as a cheap gate: while
  the element isn't anywhere near the viewport, no scroll work happens for it at all.
- While gated "on," a `scroll`/`resize` listener (throttled via `requestAnimationFrame`, at most
  one calculation per frame) reads `getBoundingClientRect()` and computes opacity as the minimum
  of two independent linear ramps, clamped to `[0, 1]`:
  - **Entry ramp** (0 → 1): as the element's top edge rises from the bottom of the viewport
    through roughly the bottom 30% of viewport height.
  - **Exit ramp** (1 → 0): as the element's bottom edge rises through roughly the top 20% of
    viewport height, offset by the sticky nav's height (~96px) — mirroring the existing
    `-96px 0px -70% 0px` bias in `useActiveSection`, so an element only starts fading out once
    it's genuinely passing under the nav, not merely nearing the top of an oversized viewport.
  - Exact ramp-size constants are tunable during implementation/visual polish; the above are
    starting values, not hard requirements. Nested rows may end up with tighter ramp distances
    than whole sections since rows are shorter — a tuning detail, not a mechanism difference.
- Computed opacity is written directly to `element.style.opacity` (imperative DOM write via the
  ref), **not** React state — avoids a re-render on every scroll frame, and avoids any CSS
  `transition` on opacity (a CSS transition would lag behind rapid scroll deltas and produce a
  rubber-banding effect; the computed value already matches scroll position exactly, so the
  motion is inherently smooth without one).
- **Reduced motion:** if `window.matchMedia('(prefers-reduced-motion: reduce)').matches`, the
  hook is a no-op — no observer, no listeners, opacity stays at CSS default (`1`).
- **No-JS / pre-hydration safety:** the element has no inline opacity until the effect runs, so
  it defaults to fully visible (CSS default `opacity: 1`) if JS fails to load or before hydration
  completes — this is purely a progressive enhancement, never a functionality gate. This matters
  more once applied to many nested rows: a slow-hydrating page must never leave certificate/
  position text invisible.
- **Initial mount:** the hook computes opacity once immediately on mount from the current scroll
  position (rather than starting at `0` and waiting for the first scroll event), so a page reload
  mid-scroll, or a deep link that scrolls to `initialSection` on mount, renders every section and
  row at its correct opacity immediately.

### 3. Timeline component (Employments, Education, Licenses & certifications)

Two new shared components in `src/components/common/timeline.tsx`:

- **`Timeline`** — the rail container. Renders the vertical connecting line and manages which
  entry is "active": a scoped scrollspy (own lightweight `IntersectionObserver`, same
  `rootMargin` bias as `useActiveSection`) tracks which child entry is currently under the nav,
  independent of the fade mechanic. Exposes a click handler so clicking any entry's marker
  smooth-scrolls that entry into view (mirroring `Nav`'s existing `scrollIntoView` pattern).
- **`TimelineEntry`** — one marker + content block. The marker is the entry's own logo/icon
  rendered as a circular avatar directly on the rail (no separate small dot) — the "logo-as-dot"
  style. Highlighted (accent border/ring) when it's the active entry per `Timeline`'s scrollspy.

Per-section usage:

- **Employments** (`employment_item.tsx`, rewritten): one `TimelineEntry` per company. Its
  existing nested "positions" breakdown (the small dot-and-line list of individual roles held at
  one company — e.g. Unified Post's "Software Developer" and the earlier "Java Developer | ADM
  Solutions" role before the acquisition) is kept, visually unchanged, but no longer gated behind
  the outer `AccordionItem` click — it's always rendered, and each position row gets its own
  `useScrollFade`. Companies with a single position render that position's description the same
  way, just without the "more than one position" nested-list wrapper (mirrors today's
  `positions.length > 1` conditional in `employment_item.tsx`).
- **Education** (`education_item.tsx`, rewritten): one `TimelineEntry` per entry, no nested
  positions concept (education entries don't have sub-roles) — just the entry's own description,
  itself wrapped in `useScrollFade` as a single row.
- **Licenses & certifications** (`licenses_certifications.tsx` and its item component,
  rewritten): one `TimelineEntry` per institution, uniformly — the current split between
  `AccordionGroup`-wrapped "grouped" institutions and `DividedList`-wrapped "single" institutions
  is removed; `LicenseCertificationRow` and the grouped/single filtering logic in
  `licenses_certifications.tsx` are deleted. Every institution renders its certifications as a
  list of rows nested under its `TimelineEntry`, each row its own `useScrollFade` unit (same
  pattern as Employments' nested positions) — so an institution with one certification just has a
  list of one row, and CVO Groeipunt's 18 certifications all exist in the layout and fade in/out
  individually as the user scrolls through them.

**Deleted as a result:** `src/components/common/accordion.tsx` (`AccordionChevron`/
`AccordionGroup`/`AccordionItem`) and `accordion.test.tsx` — once Employments, Education, and
Licenses & certifications no longer use them, no consumers remain anywhere in the codebase.
`src/test-utils/render-in-accordion.tsx` (the shared test helper for mounting an
`AccordionItem` inside a real `AccordionGroup`) is deleted for the same reason — it has no
purpose once `AccordionGroup`/`AccordionItem` don't exist. `src/components/licenses_certifications/license_certification_row.tsx`
is deleted (its "single certification" rendering is subsumed by the uniform `TimelineEntry`
usage).

### 4. Nav rename

`nav.tsx`'s first `NAV_ITEMS` entry changes from `{ titleKey: 'common:nav.home' }` to
`{ titleKey: 'introduction:title' }`, reusing the Introduction section's own title key
("Introduction 👋" / "Introductie 👋") instead of a separate, emoji-less `common:nav.home`
string — consistent with every other nav item, which already renders its section's own title key
verbatim (emoji included). The now-unused `nav.home` key is removed from
`src/app/translations/en/common.yml` and `nl/common.yml`. `nav.tsx`'s click-scroll/URL-push
logic (`targetId = slug ?? 'introduction'`) is unaffected — only the label's source key changes.

### 5. Nav centering, font size, and narrow-viewport hamburger menu

`nav.tsx`'s `<ul>` (currently `flex items-center gap-1 overflow-x-auto px-4 py-2 sm:gap-2 sm:px-6`)
centers its items and uses a larger font on wider viewports, inspired by hackconf.bg's nav
(centered, larger text) — but only the centering/sizing, not its dark permanent background, plain
(no pill) links, or diagonal accent-line decoration; this site's nav keeps its existing
light/dark-theme-aware translucent bar and active-item pill highlight unchanged.

Centering and horizontal scroll conflict on narrow viewports: a centered flex row that overflows
scrolls to show its center by default, which would hide the first item ("Introduction") off-screen
to the left without indicating there's more to scroll to. Rather than keep the horizontally-
scrollable row on narrow viewports at all, replace it with a hamburger-triggered full-screen menu
(also inspired by hackconf.bg's mobile nav):

- Below a breakpoint (e.g. `md`), the sticky bar shows only a hamburger button (☰), right-aligned,
  in place of the item row. At/above that breakpoint, the hamburger is hidden and the centered,
  larger-font item row (previous paragraph) shows instead — both markups exist in `Nav`'s output
  at all times; Tailwind responsive classes (`hidden md:flex` / `md:hidden`) decide which is
  visible, rather than a JS-measured viewport-width check, so there's no hydration mismatch.
- Tapping the hamburger opens a full-screen overlay (fixed, covers the viewport, same
  light/dark-theme-aware surface tokens as the rest of the nav) listing all six items stacked
  vertically with larger touch targets. The hamburger icon itself morphs into a close (✕) icon
  while open — one button, not two.
- Selecting an item in the overlay runs the existing `handleClick` logic (`scrollIntoView` +
  `history.pushState`) exactly as today, and additionally closes the overlay.
- The overlay is also dismissible via the ✕ button or the Escape key. While open, background
  scroll is locked (e.g. `document.body.style.overflow = 'hidden'`, restored on close/unmount).
- The active-section highlight (`aria-current="page"`) applies inside the overlay the same way it
  does in the wide-viewport row today.

The exact breakpoint, font-size step, and overlay entrance styling are tunable during
implementation/visual polish, not hard requirements.

### 6. Testing

- `use_scroll_fade.test.ts`: reuse `mockIntersectionObserver()`
  (`src/test-utils/mock-intersection-observer.ts`) for the gating observer, and
  `mockMatchMedia()` (`src/test-utils/mock-match-media.ts`) for the reduced-motion query (same
  boolean-media-query stub shape as its existing `prefers-color-scheme` usage). Cases: opacity
  computed correctly from given `getBoundingClientRect`/`window.innerHeight` fixtures at various
  scroll positions; reduced motion short-circuits to a no-op with opacity left at `1`; listeners/
  observer are cleaned up on unmount; initial mount computes opacity immediately without waiting
  for a scroll event. Not tested: the actual smooth visual motion/easing feel — not meaningfully
  assertable in jsdom, which has no real layout or paint.
- `section.test.ts(x)`: renders heading (icon + title) and `children`; no button, no
  `aria-expanded`, no toggle affordance; `id`/`scroll-mt-*` preserved on the root element.
- `timeline.test.tsx`: `Timeline` renders its children with the connecting rail; clicking a
  `TimelineEntry`'s marker calls `scrollIntoView` on that entry (mirrors existing `nav.test.tsx`
  assertions for click-to-scroll); the scoped scrollspy marks the correct entry active given a
  simulated `mockIntersectionObserver()` trigger.
  `employment_item.test.tsx`/`education_item.test.tsx`/`license_certification_item.test.tsx` (or
  its renamed equivalent) updated: no more `AccordionItem`/`renderInAccordion` usage; assert
  nested position/certificate rows are all present in the DOM unconditionally (not gated behind
  a click), each wrapped for `useScrollFade`.
- `nav.test.tsx`: update the "Home"-labeled assertion to expect "Introduction 👋" via
  `introduction:title`, mocked the same way the test already mocks other section title keys. New
  cases for the hamburger/overlay: hamburger button toggles the overlay open/closed and its
  `aria-expanded`; clicking an item inside the open overlay both fires the existing
  `scrollIntoView`/`pushState` behavior and closes the overlay; Escape key closes it; the ✕ state
  is reachable only while open (icon/label swap, however implemented, is asserted structurally).
- Existing `Nav` click/scrollspy/section-routing tests are otherwise unaffected — those systems
  don't change.

## Open questions / follow-ups

None outstanding — ramp-size constants and per-row vs per-section ramp distances are expected to
be tuned visually during implementation rather than re-litigated here.
