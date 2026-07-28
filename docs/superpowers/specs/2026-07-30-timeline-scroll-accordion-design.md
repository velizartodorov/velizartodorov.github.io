# Timeline: scroll-driven single-open accordion

## Problem

`useScrollFade` (`src/components/common/use_scroll_fade.ts`) currently gives every `TimelineEntry`
and `TimelineRow` an independent, continuous, position-computed opacity fade: each element reveals
itself once it crosses into its own entry ramp, then stays revealed for its whole mounted lifetime
regardless of scroll direction (a deliberate one-way design, to avoid a confirmed resonant
layout-feedback bug from letting height re-collapse on exit). There is no coordination between
elements at all — `Timeline`'s only shared state (`activeId`) drives nav-marker highlighting, not
collapse state.

The desired behavior is different in kind, not degree:

- Everything starts collapsed, and reveals only in response to the user scrolling down to it.
- Once an item has been seen, it collapses again — permanently, for the rest of the visit. Scrolling
  back up over it must not reopen it.
- Only one scroll-revealed item is open at a time, across the whole page (entries and nested rows
  share the same pool) — opening the next item closes whatever was open before it, wherever it was.
- A manual chevron click remains available as an independent override, separate from the
  scroll-driven mechanism, and can leave more than one item open at once.

The existing continuous opacity ramp and its one-way-reveal invariant were built to solve a problem
(scroll re-touching height, causing runaway oscillation) that a discrete, pointer-based accordion
doesn't have in the same way — closing is no longer "scroll un-revealing something," it's "a later
item became the open one." This spec replaces the mechanism rather than extending it.

## Goals

- Collapsed by default; nothing opens until the user has actually scrolled (or resized) at least
  once — matches today's `collapsedOnMount` guarantee, including for content already inside the
  viewport on load (e.g. a deep link).
- Exactly one scroll-driven "open" item at any time, chosen from a single pool spanning every
  `TimelineEntry` and every `TimelineRow` with collapsible content, in document order.
- Opening a later item automatically closes whichever item was open before it — regardless of
  whether that's a sibling row, a different entry, or an ancestor entry standing in for a still-open
  descendant row.
- Once an item has been the open item and scroll has moved past it, it never reopens from scrolling
  back up. Progress through the page is one-directional.
- A row can only be visibly open while its parent entry is expanded enough to show it. The parent
  entry's own reveal is therefore driven by the same mechanism, not a separate one.
- Manual chevron clicks keep working as a per-item override, independent of the scroll pointer, and
  are unaffected by whatever the scroll pointer is doing (can coexist with it being open elsewhere).
- `prefers-reduced-motion` still gets no transition, ideally for free from CSS rather than a JS
  branch.

## Non-goals

- No change to `Timeline`'s existing `activeId` / nav-marker-highlighting behavior — that observer
  and its `-96px 0px -70% 0px` band stay exactly as they are today, answering "which entry's dot is
  nearest the top," a bidirectional question independent of the new one-directional accordion
  pointer. The two will use separate `IntersectionObserver` instances even though they watch
  similar geometry, to keep "where am I" and "what's open" from becoming entangled.
- No change to `Section`/`useActiveSection` or the top-level page-section fade-in — this spec only
  touches `TimelineEntry`/`TimelineRow` collapsible content.
- No attempt to let a manually-opened item "count" toward the scroll pointer's forward progress, or
  to prevent the scroll pointer from opening something else on top of a manually-opened item. The
  two systems are independent, per the approved design; a user can end up with more than one item
  open by mixing scroll and clicks.
- No product decision about whether the *first* item on a page should auto-open on mount without
  requiring a scroll — it stays collapsed like everything else, consistent with "reveal only when
  scrolling down."

## Design

### 1. A single ordered pool, addressed by path

Every collapsible node — a `TimelineEntry`'s content, or a `TimelineRow`'s content when it has
`children` — is a node in one shared pool, identified by a path:

- An entry's own path is `[entryId]`.
- A row's path is `[entryId, rowId]`, where `entryId` is supplied by the nearest ancestor
  `TimelineEntry`, not passed down manually through `TimelineRail`.

`TimelineRow` doesn't currently know which entry it's inside. `TimelineEntry` will provide its `id`
through a small new React context (distinct from the existing `TimelineContext`, or an added field
on it) so `TimelineRow` can read it and build its own path without prop-threading through
`TimelineRail`. `TimelineRow` gains a required `id` prop (existing callers already have a loop index
— `posIdx`/`certIdx` — to pass) so its path is stable and unique within its parent.

`Timeline` holds one piece of shared accordion state: `openPath: string[] | null` — the path of the
current deepest open node, or `null` before anything has opened.

**A node is revealed if its own path is a prefix of (or equal to) `openPath`.** This is what lets a
row be open while its parent entry is also "revealed" without the parent being a separate, second
open item — the parent is showing only because it's on the way to the thing that's actually open.
Anything whose path isn't a prefix match is collapsed.

### 2. Advancing the pointer

`Timeline` runs one `IntersectionObserver` (new, separate from the existing `activeId` one) over the
same kind of thin band under the nav, watching every registered entry and row. `TimelineEntry` and
`TimelineRow` register/unregister into this pool the same way entries already register for
`activeId` today.

When a node's element enters the band, advance `openPath` to that node's path **only if** it is
later in document order than the current `openPath`'s leaf, compared via `element.compareDocumentPosition()`
on the actual DOM nodes (robust to React's child-effects-before-parent mount ordering, which ruled
out relying on registration order). If several nodes enter the band in the same observer callback
batch, advance to the earliest (topmost) one that still qualifies as "later than current" — one step
of forward progress at a time, not a multi-item skip.

This single rule — "only advance to something later in the document" — is what gives both requested
behaviors without tracking scroll direction as a separate signal:

- Scrolling down naturally encounters later nodes, so the pointer advances and prior items fall out
  of the revealed prefix (they close).
- Scrolling back up re-enters the band of earlier, already-passed nodes, which fail the
  "later than current" check and are ignored — nothing reopens.

If `openPath` is `null` (nothing opened yet), any node entering the band becomes the initial
`openPath`, gated on the "has actually scrolled/resized once" guard in §3 below.

### 3. Collapsed-by-default guard

To preserve "reveal only in response to scrolling" even when a node is already sitting inside the
band on mount (page loaded mid-scroll, or a deep link), `Timeline` tracks a one-time
`hasScrolledRef`, flipped by a `scroll`/`resize` listener attached once the pool is non-empty.
The accordion-advancing `IntersectionObserver` callback only acts once `hasScrolledRef.current` is
true — its synchronous initial callback on `observe()` (which fires even without a user scroll) is
otherwise ignored. This mirrors today's `collapsedOnMount` guard in spirit, without needing
`useScrollFade`'s per-element ramp math to implement it.

### 4. Manual click stays independent, using today's "hands over ownership" pattern

Each node keeps a small local `manuallyPinned` boolean and a `hasBeenToggled` flag, exactly
mirroring the current `userControlledRef` idea in `use_scroll_fade.ts`. The first click flips
`hasBeenToggled` to `true` and sets `manuallyPinned` to the opposite of whatever the node is
currently showing. From that point on:

```
revealed = hasBeenToggled ? manuallyPinned : isPrefixOfOpenPath(myPath, openPath)
```

The scroll pointer keeps advancing normally regardless of any node's manual state — it simply stops
being the thing that decides `revealed` for a node once that node has been clicked. This is a direct
reuse of the existing, already-proven pattern, just rebased onto path-membership instead of
continuous opacity as the "before you touched it" source of truth.

One consequence worth stating explicitly (not a bug): if a user manually collapses a *branch* entry
(one with rows) while one of its rows is the scroll-open item, the row visually disappears too,
because its parent's own `grid-template-rows` is what gives it any height at all. The row's own
`revealed` value is irrelevant once its structural ancestor is collapsed.

### 5. Simplified reveal styling — drop the JS opacity ramp

Because open/closed is now a discrete boolean per node instead of a continuously-computed scroll
position, the per-frame `requestAnimationFrame` loop, `computeOpacity`, `ENTRY_RATIO`/`EXIT_RATIO`/
`NAV_OFFSET_PX`/`REVEAL_DISTANCE_PX`, and the imperative `el.style.opacity` writes in
`use_scroll_fade.ts` are all deleted. Reveal becomes a pair of Tailwind classes toggled by the same
boolean already driving `grid-template-rows`:

```
transition-[grid-template-rows,opacity] duration-200 ease-out motion-reduce:transition-none
${revealed ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}
```

`motion-reduce:` disables both transitions at once via CSS, so the JS-level
`prefers-reduced-motion` branch in the current hook (and its distinct snap-vs-ramp behavior) is no
longer needed — reduced-motion users simply get the same instant class flip everyone else gets, just
without the animation, which is the same end state the current special-casing produces today.

### 6. `useScrollFade` is replaced, not extended

Given the scope of the above, `use_scroll_fade.ts` is replaced by a new hook (name TBD in the
implementation plan, e.g. `useTimelineNode`) that a `TimelineEntry`/`TimelineRow` calls with its own
`path`, and which reads/writes the shared accordion state from `Timeline`'s context plus the small
per-node manual-pin state described in §4. `Section`'s current use of `useScrollFade` (non-collapsed,
plain position-based fade-in) is unaffected by this spec and either keeps a slimmed-down version of
the old hook for itself or inlines its own simple fade — a decision for the implementation plan,
since it's not part of this behavior change.

### 7. Cleanup on unmount

If a node that's part of the current `openPath` (itself or an ancestor prefix of it) unregisters,
`Timeline` clears `openPath` back to `null` rather than leaving it pointing at a removed element,
since a later element re-entering the band is what will naturally pick a new open node next.

## Testing

- New/replacement tests for the shared accordion hook: forward-only advancement (a later node opens
  and closes the prior one; an earlier node re-entering the band is a no-op), the collapsed-until-
  first-scroll/resize guard, and the manual-pin-takes-over-permanently behavior.
- `timeline.test.tsx` / `timeline_row.test.tsx`: assert prefix-based reveal (entry revealed while a
  child row is the deep-open node), and that opening a row elsewhere collapses a previously-open
  entry.
- `mock-intersection-observer.ts` already supports triggering entries manually and should cover the
  new observer without changes; confirm during implementation whether it needs to support multiple
  concurrent `IntersectionObserver` instances (existing `activeId` one plus the new accordion one).
- Employment/education/license item tests: spot-check that opening a later item in the list closes
  an earlier one, using the real component tree (`renderInAccordion`-style helper is gone; use
  `Timeline` directly per existing `timeline.test.tsx` patterns).

## Open questions / follow-ups

- Exact hook/API naming is left to the implementation plan.
- Whether `Section`'s fade-in keeps sharing code with the new timeline-node hook or gets its own
  small inlined version is an implementation-plan decision, not a behavior question — this spec
  doesn't change `Section`'s behavior either way.
