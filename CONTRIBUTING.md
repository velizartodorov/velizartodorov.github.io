# Contributing

This is a personal portfolio, so outside contributions are limited. Issues and small fixes are
welcome, but building or running the app needs read access to the private
[`portfolio-resources`](https://github.com/velizartodorov/portfolio-resources) submodule (see
[README.md](README.md) → "Translation files"). Without that access, `npm run dev`, `npm run build`,
and the test suite won't succeed.

## Where changes go

- **Resume content** (dates, employment/education text, logos, the certificate PDF, the photo):
  edit it in `portfolio-resources` only and push to its `master`. Its sync workflow opens an
  auto-merging bump PR here; don't bump the submodule pointer by hand. See [README.md](README.md)
  → "Updating content".
- **Everything else** (components, styling, i18n wiring, CI): make the change in this repo.

## Workflow

1. Branch off `master`.
2. To bring the branch up to date, rebase onto `origin/master` instead of merging it in.
3. Use [Conventional Commits](https://www.conventionalcommits.org/) prefixes, e.g. `feat:`,
   `fix:`, `docs:`, `chore:`, `ci:`.
4. Open a PR against `master`. The `build` check must pass before merging.

## Local checks

Use Node 24, which CI uses too. Other major versions break the Vitest/jsdom setup.

```bash
npm install
npm run lint
npm run format:check
npx tsc --noEmit
npm run coverage
```

Vitest doesn't type-check, so run `npx tsc --noEmit` for type changes. Delete the
`tsconfig.tsbuildinfo` it creates and never commit it. The pre-commit hook (Husky + lint-staged)
runs ESLint, Prettier, and the encoding check on staged `src/` files.

## Code style

- No comments in production code (`src/**/*.{ts,tsx}`, excluding tests and `src/test-utils/`).
  Make the code explain itself with clearer names or extracted helpers instead.
- No copy-pasted logic. Extract a named helper when the same step runs in two places.

## Tests

- Colocate tests with the source (`foo.ts` → `foo.test.ts`), using Vitest and Testing Library.
- Shared helpers and fixtures live in `src/test-utils/`. Reuse them before writing new ones, and
  add any new file there to `sonar.exclusions` in `sonar-project.properties`.
- Don't copy production values into tests. Import the real constants, path builders, and
  translations (`loadAllStrings()`) and derive the assertions from them.

[CLAUDE.md](CLAUDE.md) has the full test and fixture conventions.
