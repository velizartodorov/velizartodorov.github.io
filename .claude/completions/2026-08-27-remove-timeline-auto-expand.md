# Remove timeline auto-expand (scroll-driven accordion)

## What changed

The page-wide "scroll-driven accordion" — as you scrolled, each timeline entry/row
auto-opened when it crossed a band under the nav and the previously-open one collapsed —
is removed across all three timeline sections (Employments, Licenses & certifications,
Education). Everything is now chevron/header-click only.

### Source
- **Deleted** `src/components/common/accordion_provider.tsx` (+ test) — the `IntersectionObserver`,
  `AccordionContext`, `ACCORDION_ROOT_MARGIN`.
- **Deleted** `src/components/common/timeline_accordion.ts` (+ test) — `NodePath`, `pathKey`,
  `isOnOpenPath`, `pickAdvanceCandidate` all became unused.
- `use_timeline_node.ts` — stripped to a `useState`-backed manual toggle. No `path`/`ref` args,
  no context. `togglePin` renamed to `toggle`; `revealed` kept. Still a shared hook (both
  `TimelineEntry` and `TimelineRow` use it).
- `timeline.tsx` — `TimelineEntry` calls `useTimelineNode()` with no args; dropped `inertRef`;
  `EntryIdContext` kept purely as the `TimelineRow` mount guard.
- `timeline_row.tsx` — `TimelineRow` calls `useTimelineNode()` with no args; dropped `rowRef` /
  `inertRef`; kept the `entryId` null-check.
- `App.tsx` — removed the `<AccordionProvider>` wrapper.
- Comment-only touch-ups in `chevron_toggle_button.tsx`, `use_scroll_fade.ts`.

### Tests
- Rewrote `use_timeline_node.test.tsx` down to: starts collapsed / toggle open+close /
  independent instances.
- `timeline.test.tsx`, `timeline_row.test.tsx` — dropped the `AccordionProvider` wrapper and
  accordion imports; deleted the scroll-accordion describe blocks and the "two observers" →
  "one activeId observer" case; kept chevron-toggle and childless-entry cases.
- Dropped the `AccordionProvider` wrapper from `render-in-timeline.tsx`,
  `render-in-timeline-entry.tsx`, and the local render helpers in `dates.test.tsx`,
  `education.test.tsx`, `presentations.test.tsx`, `languages.test.tsx`,
  `languages.edge-cases.test.tsx`.

## Verification
- `npx tsc --noEmit` — clean.
- `npx eslint` + `npx prettier --check` on all changed files — clean.
- 13 directly-affected test files (68 tests) — pass.
- Full suite: 274/275. The one failure is `App.test.tsx`'s language-switching **performance**
  assertion (wall-clock ms), the pre-existing full-suite timing flake documented in CLAUDE.md;
  `App.test.tsx` passes 25/25 in isolation. This change only removes work from the render tree.

## Untouched on purpose
- `activeId` scrollspy (which marker is highlighted), scroll-fade, nav.
- Historical spec docs under `docs/superpowers/specs/2026-07-30-timeline-scroll-accordion-*`.
