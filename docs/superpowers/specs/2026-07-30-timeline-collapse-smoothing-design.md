# Timeline collapse: fix premature reveal, add smooth height transition

## Problem

`useScrollFade` (`src/components/common/use_scroll_fade.ts`) drives both the scroll-linked fade
and the collapsed-by-default/chevron-pin behavior for `TimelineEntry` (`timeline.tsx`) and
`TimelineRow` (`timeline_row.tsx`). Two problems were confirmed by live-testing the running app
(clicking chevrons and dispatching real `scroll`/`resize` events against the actual DOM/React
state, not just reading the source):

1. **Entries/rows silently pop open before the user ever reaches them.** In `recompute()`,
   `setRevealed(true)` — which expands the element's `grid-template-rows` from `0fr` to `1fr`,
   i.e. "opens" it — fires unconditionally the first time a recompute runs for a
   `collapsedOnMount` element, regardless of whether that element has actually started entering
   its position-based fade zone (`computeOpacity(...)` can still return `0`). The gating
   `IntersectionObserver` that attaches the `scroll`/`resize` listeners uses a generous
   `100% 0px 100% 0px` rootMargin (a full viewport above/below counts as "near"), so **any**
   scroll or resize event can flip a far-off, fully invisible (`opacity: 0`) entry's height and
   chevron to "expanded" state — confirmed live: a single `resize` event flipped every entry that
   had ever been "near" the viewport to `aria-expanded: true`, including one sitting 6000+px down
   the page. This reads as content reopening/reappearing on its own while scrolling, undermining
   the collapsed-by-default design.

   By contrast, the existing guard against scroll re-touching a *manually* pinned-closed element
   (`userControlledRef`) was stress-tested directly (real `scroll`/`resize` events, both
   directions, at both the entry and nested-row level) and held correctly in every case — that
   mechanism is not the source of the bug and needs no change.

2. **No animation on open/close.** `TimelineEntry` and `TimelineRow` both render their collapsible
   content inside a `grid ${revealed ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}` wrapper with an
   explicit comment ruling out a transition, reasoning that many entries revealing in the same
   scroll burst would animate their heights simultaneously and make the document's scroll height
   ripple frame-by-frame, flickering the scrollbar. The height change is instead an abrupt snap,
   for both the one-time scroll-driven reveal and manual chevron toggles.

## Goals

- Height only ever expands (`revealed` flips `true`) once an element has genuinely started
  entering its position-based fade ramp — never merely because a scroll/resize event happened to
  fire while the element sat anywhere in the wide gating margin.
- Collapse/expand height changes are smoothly animated — both the one-time scroll-driven reveal
  and manual chevron toggles — instead of snapping instantly.
- `prefers-reduced-motion` users get no height transition, consistent with how `useScrollFade`
  already short-circuits opacity ramping for them.
- No change to the manual-pin guard (`userControlledRef`) — it already behaves correctly.

## Non-goals

- No change to the opacity fade mechanic, ramp constants, or gating `IntersectionObserver`
  margin itself — only *when* `setRevealed(true)` is allowed to fire.
- No attempt to cap or throttle how many elements can animate their height in the same frame. A
  very fast fling-scroll could still catch a few elements starting their ramp within the same
  frame and animate together; per-element gating on `target > 0` (Goal 1) narrows this window
  considerably since elements naturally enter their ramps at different scroll positions, but it
  is not a hard guarantee against any simultaneity. This is an accepted, revisit-if-it-looks-bad
  tradeoff, not something this change tries to solve outright.
- No change to `useScrollFade`'s opacity write (`element.style.opacity`, imperative, no CSS
  transition) — only height gets a CSS transition. Opacity stays scroll-position-exact for the
  reasons already documented in `use_scroll_fade.ts`.

## Design

### 1. Fix: gate `setRevealed(true)` on the element actually entering its ramp

In `recompute()` (`use_scroll_fade.ts`), the branch that handles a not-yet-revealed
`collapsedOnMount` element currently does:

```js
if (!reducedMotion && collapsedOnMount && !hasRevealedOnceRef.current) {
    revealStartScrollY ??= window.scrollY;
    setRevealed(true);
    const progress = clamp01(Math.abs(window.scrollY - revealStartScrollY) / REVEAL_DISTANCE_PX);
    el.style.opacity = String(progress * target);
    if (progress >= 1) hasRevealedOnceRef.current = true;
}
```

`target` (from `computeOpacity`) is already computed earlier in `recompute()` before this branch
runs. Change the condition so `setRevealed(true)` (and the start of the distance-based opacity
ramp, i.e. capturing `revealStartScrollY`) only happens once `target > 0` — i.e. the element has
actually begun crossing into its entry ramp per `computeOpacity`, not merely because a listener
fired. Until then, the element stays fully collapsed (`revealed` stays `false`, height `0fr`,
opacity `0`) even if intermediate recompute calls happen while it's gated "near."

This is a one-line condition change, not a restructuring — `computeOpacity`, the gating
`IntersectionObserver`, `REVEAL_DISTANCE_PX`, and every other constant/mechanism are unchanged.

### 2. Smooth height transition

Add a Tailwind transition utility to the grid wrapper `div` in both `TimelineEntry`
(`timeline.tsx`) and `TimelineRow` (`timeline_row.tsx`):

```
transition-[grid-template-rows] duration-200 ease-out motion-reduce:transition-none
```

200ms/ease-out matches the chevron icon's own existing rotate transition
(`chevron.tsx`: `transition-transform duration-200`), so the chevron flip and the content reveal
read as one synchronized motion rather than two staggered ones. `motion-reduce:` (Tailwind's
`prefers-reduced-motion: reduce` variant) disables the transition outright for users who already
get instant, ramp-free behavior from the hook's own JS-level reduced-motion branch — no visual
mismatch between "opacity snaps instantly" and "height eases in."

Update the removed comment (the one currently ruling out a transition) to explain why animating
is now acceptable: per-element reveals are gated on genuinely entering view (Design §1), which
narrows — without eliminating — the chance of many elements animating in the same frame; see
Non-goals for the residual risk being an accepted, revisit-later tradeoff rather than something
solved here.

No change to `ChevronToggleButton`, `TimelineEntry`/`TimelineRow`'s other markup, or the
`useScrollFade` API surface (`togglePin`/`revealed`/`pinnedOpen` signatures are unchanged) — this
is purely the wrapper `div`'s className plus the one-line gating fix in the hook.

## Testing

- `use_scroll_fade.test.ts`: add a case asserting that a recompute firing while the element's
  computed `target` opacity is still `0` (i.e. `getBoundingClientRect` far outside the entry ramp,
  even though the gating observer reports "near") leaves `revealed` at `false` and does not touch
  `hasRevealedOnceRef`/`el.style.opacity`'s ramp start — only once a subsequent recompute reports
  `target > 0` does `revealed` flip `true` and the distance ramp begin. Existing cases covering
  the distance-based ramp itself, `prefers-reduced-motion`, the manual pin/toggle guard, and
  cleanup are otherwise unaffected — this is an additional gating condition on an existing branch,
  not a rewrite of it.
- `timeline.test.tsx` / `timeline_row.test.tsx`: assert the grid wrapper carries the new
  `transition-[grid-template-rows]`/`duration-200`/`motion-reduce:transition-none` classes.

## Open questions / follow-ups

None outstanding. The residual same-frame-simultaneity risk noted in Non-goals is a known,
accepted tradeoff to watch for after this ships, not a blocking question.
