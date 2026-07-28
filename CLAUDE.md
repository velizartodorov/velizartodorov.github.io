# Code style

- No copy-pasted logic. When the same check or step runs in two places (e.g. a `scroll`
  listener and an `IntersectionObserver` callback both needing the same "at the bottom of the
  page?" branch), extract one named helper and call it from both — see `useActiveSection`'s
  `updateActive` in `src/components/nav/use_active_section.ts`.

- No comments in production code (`src/**/*.{ts,tsx}`, excluding `*.test.*` and
  `src/test-utils/`). Make it read on its own — rename the variable, extract a well-named helper,
  or restructure until the "why" is obvious from the code. A comment explaining a line means that
  line isn't clear enough yet. Test files are exempt: they may keep comments describing a
  non-obvious scenario or a jsdom/Next workaround.

# Tests & fixtures

## Layout

- Test files are colocated with source (`foo.ts` → `foo.test.ts`), using Vitest + Testing Library.
- Shared test helpers live in `src/test-utils/*.ts` (not `*.test.*`, so Vitest won't run them as
  suites). This folder is also excluded from SonarCloud's source analysis in
  `sonar-project.properties` (`sonar.exclusions`) since it's test-support code, not production
  source — add any new `test-utils` file there too.
- Run everything: `npm run coverage` (`vitest run --coverage`). Verify type changes with
  `npx tsc --noEmit` — Vitest's esbuild transform does not type-check. Delete the resulting
  `tsconfig.tsbuildinfo` afterward; it's a local build artifact, never commit it.

## Reuse production values — don't re-declare them in the test

A test must not keep its own copy of a constant, list, string, or URL/path scheme that
production already exports. Import the real thing and derive from it, so adding or renaming
something in production forces the test to follow instead of silently drifting.

- **Iterate the production list.** `nav.test.tsx` loops `NAV_ITEMS` (from `nav_items.ts`) rather
  than hard-coding the six nav entries and their order.
- **Compute paths/URLs with the production function.** Assert `href` against
  `sectionPath(lang, slug)` (from `app/sections.ts`), not a literal `'/nl/employments/'` — one
  non-derived literal elsewhere (e.g. the `pushState` spy assertion) is enough to pin the format.
- **Resolve translated text through `loadAllStrings()`.** `await loadAllStrings()` (from
  `src/app/translations/resources.ts`) returns a sync resolver `strings(lang, 'namespace:dotted.key')`
  that walks the real, assembled resource tree for that language and returns the node whole
  (string, array, or object — like i18next's `returnObjects`). Pass `(key) => strings('en', key)`
  straight to `mockUseTranslation` as the mocked `t` so rendered text and assertions share one
  source (`nav.test.tsx`'s `label()` wraps it with the accessible-name whitespace collapse).
  Don't hand-write a `titleKey → text` map or a `MONTHS` / `common:period` literal. Importing
  `resources.ts` is safe from files that `vi.mock('react-i18next', …)` — it pulls its language
  list from the i18next-free `translations/languages.ts`, not `i18n.ts`.
- **Key off the production DOM contract.** `timeline_active.test.tsx`'s `entryEl()` selects on
  the `data-timeline-entry={id}` attribute `TimelineEntry` renders, and `marker()` takes the one
  `<button>` inside it — no display-string literals in the assertions at all.

Deriving an assertion from the same function the component uses is mildly circular but still
covers wiring, ordering, prop plumbing, and the language/variant branches — that's an accepted
trade here.

## Existing shared fixtures/helpers — use these before writing a new one

- `mock-use-translation.ts` → `mockUseTranslation(t, ready?)`. Sets react-i18next's mocked
  `useTranslation()` return value. Every test file must still add its own
  `vi.mock('react-i18next', () => ({ useTranslation: vi.fn() }))` at the top — `vi.mock` is
  hoisted per-file and can't be centralized.
- `mock-match-media.ts` → `mockMatchMedia(initialMatches?)`. Stubs `window.matchMedia` (jsdom has
  none). Returns `{ mql, fireChange }` for tests that simulate an OS theme-preference change;
  ignore the return value if you just need real code touching `matchMedia` to not crash.
- `mock-intersection-observer.ts` → `mockIntersectionObserver()`. Stubs `window.IntersectionObserver`
  (jsdom has none). Returns `{ observe, disconnect, trigger }` — call `trigger(entries)` to simulate
  the browser firing the observer's callback (e.g. a section scrolling into view).
- `render-in-timeline.tsx` → `renderInTimeline(children)`. Wraps children in a real
  `<AccordionProvider><Timeline>`, required by any `TimelineEntry`-based component under test.
- `render-in-timeline-entry.tsx` → `renderInTimelineEntry(children)`. Wraps children in a real
  `<AccordionProvider><Timeline><TimelineEntry>`, required by any `TimelineRow`/`TimelineRail`-based
  component under test.
- `period-fixtures.ts` → `period(start, end?)`. A resolved `Period` (real `Date`s) from ISO date
  strings.
- `employment-fixtures.ts` → `position()` / `employment()` (resolved, post-hook shape) and
  `rawPosition()` / `rawEmployment()` (pre-hook shape, string dates/`{{dates:x}}` placeholders).
  Also several named, zero-arg fixtures (e.g. `singlePositionEmployment()`) for specific test
  files.
- `certification-fixtures.ts` → `certification()` / `licenseInstitution()`, plus named fixtures
  per consuming test file.
- `education-fixtures.ts` → `educationEntry()`.
- `build-resources-fixtures.ts` → `frontmatterPosition()` / `frontmatterEmployment()` /
  `frontmatterIndex()` (raw markdown-frontmatter shape) and `assembledEmployment()` (the
  post-`assembleEmployment()` shape).

## Rules for adding/changing fixtures

1. **Employment data has three distinct shapes — don't conflate them.**
   - Raw markdown-frontmatter (`body` + delimiter, no per-position `description`) — lives in
     `build-resources-fixtures.ts`, mirrors `build-resources.ts`'s exported `RawPosition`/
     `RawEmployment`/`Index` types.
   - Raw pre-hook translation JSON (string dates or `{{dates:x}}` placeholders, inline
     `description`) — lives in `employment-fixtures.ts`'s `rawPosition()`/`rawEmployment()`, typed
     as the real `Position`/`Employment` with a cast on `period` (matches the same loose cast
     `employments.init.ts` itself relies on for this data).
   - Resolved post-hook (real `Date`s) — `employment-fixtures.ts`'s `position()`/`employment()`.

   Each layer gets its own fixture functions. A test exercising one layer should not import
   another layer's builder just because the shapes look similar.

2. **A fixture's defaults must never be used where a test deliberately constructs sparse or
   malformed data** to exercise a hook's own `??` defaulting, a type guard (`Array.isArray`,
   `typeof x === 'string'`), or a "key missing entirely" branch. In that case, write the object as
   a raw inline literal with a comment explaining why — a fixture would silently fill in the
   exact field the test needs to leave out. (See `employments.init.test.ts` and
   `licenses_certrifications.init.test.ts` for examples of this being called out explicitly.)

3. **Prefer deriving types/values over hand-copying them.**
   - If a fixture's shape mirrors a real interface, import and derive from that interface
     (`Omit<X, ...>`, `Partial<X>`) instead of maintaining a parallel interface. Export the
     original interface from its source module if it isn't already exported.
   - If a fixture represents "the expected output of some production function," derive it by
     calling that function for real (see `assembledEmployment()`, which calls the real
     `buildEmployments()`) rather than hand-typing a literal that could silently desync from the
     input fixture's defaults.
   - Don't reach for `Omit<X, 'field'> & { field?: T }` when `T` is the same type `X.field`
     already has — that pattern only earns its keep when the override genuinely reshapes the
     field (e.g. `position()`'s override takes flat `start`/`end` strings in place of a nested
     `period` object).

4. **Reuse a generic builder with an override before adding a new one.** Named, zero-argument
   "concrete" fixtures (e.g. `singlePositionEmployment()`) are for one test file's specific,
   named scenario, so its intent reads at the call site instead of being buried in inline
   overrides — this is a deliberate style choice in this repo, not an oversight, even when such a
   fixture has exactly one caller.

5. **jsdom/Next-specific workarounds go through the shared helper, not a fresh inline stub.**
   `window.matchMedia` → `mockMatchMedia()`. `next/font/google`'s `Inter()` needs Next's SWC
   transform, which Vitest doesn't run — mock the module directly
   (`vi.mock('next/font/google', () => ({ Inter: () => ({ variable: '...' }) }))`) to whatever
   shape the component actually reads.

6. **Collapse near-identical test bodies with `it.each`**, using an object array with a `name`
   field and `'$name'` as the title so each case still gets a readable, distinct test name. Don't
   force this when cases assert genuinely different fields/shapes — that's a judgment call, not a
   mechanical rule (e.g. a test checking `totalYears`/`softwareEmployments` stays separate from a
   table of tests that only check `totalTime`).

7. **No copy-pasted scaffolding inside a test file.** Repeated setup — a `renderHook`/`render`
   wrapper, a verbose mock-entry literal (`{ isIntersecting, target, boundingClientRect: { top }
   as DOMRectReadOnly }`), an `act(() => trigger(...))` call, a re-used stub-args object — gets a
   small file-local helper at the top of the file, next to the existing ones (`addSection`,
   `stubScrollPosition`, …). See `use_active_section.test.ts`'s `renderActiveSection` / `entry` /
   `fireIntersect`. Only promote a helper to `src/test-utils/*` once a second file needs it.

## Known pre-existing flakiness

`src/app.test.tsx`'s "language switching" tests (in the `describe('language switching')` block)
can intermittently fail when run as part of the full suite under `--coverage` (never in
isolation) — a timing sensitivity, not something introduced by fixture/test work. `--retry=2` or
`--retry=3` on `vitest run` is fine for a verification pass; don't "fix" it by loosening
assertions without investigating the actual timing cause first.

---

## Session Start Protocol ⚡

**MANDATORY** at start of each session:

```bash
# Load essential docs (~800 tokens - 2 min read)
✓ .claude/COMMON_MISTAKES.md      # ⚠️ CRITICAL - Read FIRST
✓ .claude/QUICK_START.md          # Essential commands
✓ .claude/ARCHITECTURE_MAP.md     # File locations
```

**At task completion:**
- Create completion doc in `.claude/completions/YYYY-MM-DD-task-name.md`
- Move session file to `.claude/sessions/archive/` (if created)

**⚠️ NEVER auto-load:**
- Files in `.claude/completions/` (0 token cost)
- Files in `.claude/sessions/` (0 token cost)
- Files in `docs/archive/` (0 token cost)

---

**Last Updated**: 2026-08-27
**Optimized with**: [Claude Token Optimizer](https://github.com/nadimtuhin/claude-token-optimizer)
