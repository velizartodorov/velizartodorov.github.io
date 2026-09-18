# Move personal resume data into a private submodule repo

## Problem

The portfolio's source repo is public (GitHub Pages, `output: 'export'`). All of the actual
resume content — employment history, education, certifications, profile info, exact employment
and certification dates, and identity-revealing assets (company/school logos, a certificate PDF
with the owner's full name, a personal photo) — currently lives directly in this public repo:

- `src/app/translations/{en,nl}/**` (yml + md) and `src/app/translations/dates.yml`
- `src/app/translations/resource-files.ts` (hardcodes employer/school filenames, e.g. `collibra.md`)
- `public/employments/*`, `public/education/*`, `public/certificates/*`
  (`AWS-Essentials-Velizar-Todrov.pdf`), `public/header/velizar.jpg`

The goal is to be able to shut the site down later (stop deploying it) without that data staying
exposed. Today it can't be: even with the deploy turned off, the public repo itself is still
cloneable and its history holds the data forever. Personal data needs to stop entering the public
repo going forward, so that revoking access to a separate private repo (or deleting it) is what
actually removes exposure, independent of whether GitHub Pages is deploying.

## Goals

- Going forward, no personal/identifying data (resume text, exact dates, employer/school names,
  logos, the certificate PDF, the personal photo) is committed to the public repo. It lives in one
  private GitHub repo instead.
- The public repo can still build and deploy the site normally (`npm run dev`, `npm run build`,
  CI), pulling the private content in automatically — no manual per-build step to remember.
- The private repo's raw text content (yml/md) never becomes a statically-served file — Next's
  static export copies everything under `public/` into the deployed output verbatim, with no
  exclusion mechanism, so anything under `public/` is implicitly public regardless of source repo.
- SonarCloud (a third-party analysis service) never ingests the private repo's content either —
  that's a second exposure channel distinct from the public GitHub repo, and closing the first
  without the second would be an incomplete fix.
- This repo has a single maintainer (the owner of both repos); local dev and CI both authenticate
  as/for that owner. No fallback path for building without access to the private repo is needed.

## Non-goals

- No rewrite/purge of the public repo's existing git history. The data already committed there
  today remains recoverable from old commits after this ships — this design only stops
  recurrence going forward. Scrubbing history is a separate, riskier follow-up if ever wanted.
- No change to which fields/files count as "personal" beyond what's inventoried above (e.g.
  generic iconography — `public/header/{blog,driving_license,github,house,linkedin,mail}.png`,
  `public/languages/*.webp`, `public/icons/git.png`, `favicon.ico` — stays in the public repo; none
  of it identifies the owner or a third party).
- No support for contributors/CI runners that lack access to the private repo — single-maintainer
  project, so no mock/placeholder-content fallback is designed.

## Design

### 1. Private repo layout

One new private GitHub repo, `portfolio-resources`, mirrors the current translations layout at
its root and adds an `assets/` tree for the identity-revealing static files:

```
en/, nl/, dates.yml, resource-files.ts    (moved as-is, no content changes except icon paths below)
assets/
  employments/*.{jpg,jpeg,png}
  education/*.{png,jpg,svg}
  certificates/AWS-Essentials-Velizar-Todrov.pdf
  header/velizar.jpg
```

`resource-files.ts` moves in as-is (keeps its current static `EMPLOYMENT_FILES`/`EDUCATION_FILES`
arrays) rather than being refactored to derive the file list from `employmentsIndex.list` /
`educationIndex.list` at runtime — smaller diff, at the cost of `build-resources.ts`'s public
types depending on a type-only import from the private submodule (acceptable: the submodule is
always present when building/type-checking, per the single-maintainer non-goal above).

Every `icon:` field in the moved yml/md content that currently points at `/employments/...`,
`/education/...`, `/certificates/...`, or `/header/velizar.jpg` is rewritten to
`/resources/...` (see §3) as part of the migration, since these assets will be served from that
path once copied into the public repo's `public/` at build time.

### 2. Public repo: single submodule mount, never inside `public/`

The private repo is added as one git submodule at `src/app/translations/data/`. This is the only
mount point — deliberately not also mounted somewhere under `public/` (see Goals: anything
physically present under `public/` gets published, so the private repo's raw yml/md must never be
checked out there, even via a second submodule instance pointed at the same remote).

Code changes, all mechanical path updates — no logic changes:

- `src/app/translations/resources.ts`: `importYaml`/`importEmployment`/`importEducation` prefix
  their dynamic `import()` paths with `./data/` instead of `./`; `import dates from './dates.yml'`
  becomes `'./data/dates.yml'`.
- `src/app/translations/resources.ts`: `EMPLOYMENT_FILES`/`EDUCATION_FILES` (currently from local
  `./resource-files`) now imported from `./data/resource-files`.
- `src/links.test.ts`: `translationsDir` constant becomes
  `resolve(__dirname, 'app/translations/data/en')`.

No other file needs a path change — every other consumer (tests, `i18n.ts`) reaches translation
data exclusively through `loadResources`/`loadAllStrings` in `resources.ts`, confirmed by
grepping all `*.test.ts` files under `src/` for direct file-path reads (only `links.test.ts` does
its own `readFileSync`; everything else calls into `resources.ts`).

### 3. Assets reach `public/` by copy, not by mounting there

A new `scripts/prepare-resources.mjs`:

1. Runs `git submodule update --init --recursive`.
2. Clean-copies `src/app/translations/data/assets/**` → `public/resources/**` — removing any
   existing `public/resources/` first, then copying, so an asset renamed/deleted in the private
   repo doesn't leave an orphaned file behind in the public repo's build output.

`public/resources/` is added to `.gitignore` — it's a generated build artifact now, the same
category as `out/`.

This copy step is the safety boundary: it only ever reads from `assets/`, never from the
sibling `en/`/`nl/`/`dates.yml`/`resource-files.ts` in the same checkout, so a bug or omission in
this script fails *loud* (a missing/broken image on the page, immediately visible) rather than
silently leaking raw text into a public, statically-served path. This was chosen over mounting the
same private repo a second time directly under `public/` with git sparse-checkout limiting that
checkout to `assets/` only — technically workable, but sparse-checkout state isn't recorded in
`.gitmodules`, so it would need to be correctly reapplied after every fresh clone/submodule-init
(on any machine, including CI cache misses) or the full private repo — including its raw text —
would silently get checked out under `public/` and published. The copy-script approach removes
that failure mode by construction.

`package.json` gets `predev` and `prebuild` scripts that both run `node scripts/prepare-resources.mjs`,
so `npm run dev` and `npm run build` pull and sync the private content automatically; no manual
step to remember locally.

### 4. CI

Three workflows run tests or builds that require the private submodule to be present before their
test step (not merely before a build step) — `loadResources`/`loadAllStrings` (or, for
`link-check`, `links.test.ts`'s direct file read) get exercised by the test run itself:

- `.github/workflows/build-deploy.yml` — `build` job (before "Run tests") and `link-check` job
  (before "Check external links").
- `.github/workflows/sonarcloud.yml` — `sonarcloud` job (before "Run tests with coverage").

Each of these gets one added step, immediately after `actions/checkout@v5`:

```yaml
- name: Configure access to private resources repo
  run: git config --global url."https://x-access-token:${{ secrets.RESOURCES_REPO_TOKEN }}@github.com/".insteadOf "https://github.com/"
- name: Fetch private resources
  run: node scripts/prepare-resources.mjs
```

`RESOURCES_REPO_TOKEN` is a new repo secret: a fine-grained GitHub PAT scoped only to
`portfolio-resources`, with `Contents: Read-only` permission. The main repo's own checkout keeps
using the default `GITHUB_TOKEN` unchanged (that token can't see the private repo, so it must
stay separate from the credential used for the submodule fetch — the `url.insteadOf` rewrite
above only affects subsequent `git` operations like the submodule clone, not the checkout action's
own auth). Fine-grained PATs expire (max ~1 year); this needs a recurring reminder to rotate
before expiry, since an expired PAT would break every workflow that touches the submodule.

### 5. Closing the SonarCloud exposure channel

Once the submodule is checked out in `sonarcloud.yml`'s job, SonarCloud's `sonar.sources=src`
would otherwise pick up `src/app/translations/data/resource-files.ts` (a `.ts` file naming every
employer/school) and upload it to a third-party service — a second leak distinct from the public
GitHub repo. `sonar-project.properties`'s `sonar.exclusions` gets `src/app/translations/data/**`
added, the same pattern already used for `src/test-utils/**`.

## Testing

No new test *behavior* to cover — this is a data/build-plumbing relocation, not a logic change.
Existing coverage continues to exercise the same code paths (`resources.test.ts`,
`i18n.test.ts`, `completeness.test.ts`, `links.test.ts`, and every component test that calls
`loadAllStrings()`) against the relocated content once the submodule is present; verification is
that the full suite (`npm run coverage`) and `npx tsc --noEmit` still pass after the migration, and
that a real `npm run build` + local `npx serve out` renders the site identically (employer logos,
certificate link, photo, all text) to confirm the `public/resources/` copy and rewritten `icon:`
paths line up.

## Migration

1. Create the private repo `portfolio-resources`; push the moved content (with `icon:` paths
   rewritten to `/resources/...`) as its initial commit.
2. In the public repo: remove the moved files/directories from their current locations, add the
   submodule at `src/app/translations/data/`, add `scripts/prepare-resources.mjs`, wire
   `predev`/`prebuild`, update `resources.ts`/`links.test.ts` import paths, add
   `public/resources/` to `.gitignore`, add the exclusion to `sonar-project.properties`.
3. Create the fine-grained PAT (`Contents: Read-only`, scoped to `portfolio-resources` only); add
   it as the `RESOURCES_REPO_TOKEN` repo secret.
4. Add the two new steps to `build-deploy.yml` (`build` and `link-check` jobs) and to
   `sonarcloud.yml`.
5. Commit and push; verify all three workflows go green and the deployed site is visually
   unchanged.

## Open questions / follow-ups

- The PAT's expiry needs a recurring reminder to rotate (not automated by this design).
- History scrubbing of the public repo (Non-goals) is explicitly out of scope here but remains
  available as a future, separate piece of work if ever wanted.
