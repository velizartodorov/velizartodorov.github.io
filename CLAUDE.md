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

## Existing shared fixtures/helpers — use these before writing a new one

- `mock-use-translation.ts` → `mockUseTranslation(t, ready?)`. Sets react-i18next's mocked
  `useTranslation()` return value. Every test file must still add its own
  `vi.mock('react-i18next', () => ({ useTranslation: vi.fn() }))` at the top — `vi.mock` is
  hoisted per-file and can't be centralized.
- `mock-match-media.ts` → `mockMatchMedia(initialMatches?)`. Stubs `window.matchMedia` (jsdom has
  none). Returns `{ mql, fireChange }` for tests that simulate an OS theme-preference change;
  ignore the return value if you just need real code touching `matchMedia` to not crash.
- `i18n-fixtures.ts` → `MONTHS`, `PERIOD_LANG`. Shared literals for mocked translation lookups.
- `render-in-accordion.tsx` → `renderInAccordion(children)`. Wraps children in a real
  `<AccordionGroup>`, required by any `AccordionItem`-based component under test.
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

## Known pre-existing flakiness

`src/app.test.tsx`'s "language switching" tests (in the `describe('language switching')` block)
can intermittently fail when run as part of the full suite under `--coverage` (never in
isolation) — a timing sensitivity, not something introduced by fixture/test work. `--retry=2` or
`--retry=3` on `vitest run` is fine for a verification pass; don't "fix" it by loosening
assertions without investigating the actual timing cause first.
