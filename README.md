# Velizar's portfolio 👨‍💼

[![Build and Deploy](https://img.shields.io/github/actions/workflow/status/velizartodorov/velizartodorov.github.io/build-deploy.yml?label=build&logo=githubactions&logoColor=white)](https://github.com/velizartodorov/velizartodorov.github.io/actions/workflows/build-deploy.yml)
[![Tests](https://img.shields.io/github/actions/workflow/status/velizartodorov/velizartodorov.github.io/sonarcloud.yml?label=tests&logo=vitest&logoColor=white)](https://github.com/velizartodorov/velizartodorov.github.io/actions/workflows/sonarcloud.yml)

![Next.js](https://img.shields.io/github/package-json/dependency-version/velizartodorov/velizartodorov.github.io/next?label=Next.js&logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/github/package-json/dependency-version/velizartodorov/velizartodorov.github.io/react?label=React&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/github/package-json/dependency-version/velizartodorov/velizartodorov.github.io/dev/typescript?label=TypeScript&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/github/package-json/dependency-version/velizartodorov/velizartodorov.github.io/dev/tailwindcss?label=Tailwind%20CSS&logo=tailwindcss&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-24-339933?logo=nodedotjs&logoColor=white)

Next.js (App Router, static export) web application representing Velizar's portfolio:

<https://velizartodorov.github.io/>

## How to start locally? 🤔

First, install the dependencies:

```bash
npm install
```

Then, to start the development server:

```bash
npm run dev
```

The app will be available at <http://localhost:3000/>.

To build for production (outputs a static site to `out/`):

```bash
npm run build
```

To preview the production build locally:

```bash
npm run serve
```

That's it. Have fun! 😎 🎉

## Translation files 🔠

The application uses YAML and Markdown files for translations located in the `src/translations`
directory. Each language (en, nl) has its own set of translation files. Rather than a static
per-language bundle, each file is fetched on demand through a dynamic `import()` templated on the
language, so a page only ever downloads the one language's content it actually renders; the
results are then assembled into a single resources object for that language.

### Structure

- `src/translations/`
  - `dates.yml` - shared date placeholders (e.g. `collibra_start`), referenced from content as
    `{{dates:collibra_start}}` and resolved at runtime by `useEmployments()`
  - `en/`, `nl/` - one folder per language, each containing:
    - `common.yml`, `introduction.yml`, `languages.yml`, `licenses_certifications.yml`,
      `presentations.yml`, `profile.yml` - simple key/value YAML namespaces
    - `employments.yml`, `education.yml` - index files (`title` + ordered `list` of filenames)
      defining which entries appear and in what order
    - `employments/*.md`, `education/*.md` - one Markdown file per entry, with YAML frontmatter
      (company/place/period, etc.) and the description as the Markdown body. Employment entries
      with multiple positions separate each position's body with an `<!-- position -->` marker
  - `resource-files.ts` - the single source of truth for which employment/education Markdown
    files exist (`EMPLOYMENT_FILES` / `EDUCATION_FILES`), typed so a filename present in one
    language's folder but missing (or misspelled) in the other fails to compile
  - `resources.ts` - `loadResources(lang)`, which dynamically imports every YAML/Markdown file for
    a language and hands them to `build-resources.ts`
  - `build-resources.ts` - `buildLanguageResources()` assembles the loaded index files plus their
    Markdown entries into the final `{ title, list }` shape consumed by the app (splitting
    multi-position employment bodies on the `<!-- position -->` marker along the way)
  - `completeness.test.ts` - Vitest check that every key path present in `en`'s resources also
    exists in `nl` (and vice versa), so a missing translation fails the build instead of silently
    falling back

Markdown frontmatter is parsed at build time by `loaders/markdown-frontmatter-loader.cjs`
(via `gray-matter`), which turns each `.md` file into a JS module exporting its frontmatter
fields plus a `body` string.

## CI/CD 🚀

### Github Workflows 🏭

Three workflows run in `.github/workflows/`:

- **`build-deploy.yml`** - on PR and on push to `master`: installs dependencies, checks for
  encoding corruption, lints, runs the Vitest suite (excluding the link-check/analytics tests,
  which run separately), and builds the static export. Pushes to `master` (and manual
  `workflow_dispatch` runs) additionally upload and deploy the build to GitHub Pages. To avoid
  triggering CI/deploys for doc-only changes, both the `pull_request` and `push` triggers ignore
  `**.md` files - except any Markdown under `src/`, since those files (translations, employment
  and education entries) are real content consumed by the build. A separate `link-check` job in
  the same workflow (non-blocking, `continue-on-error`) checks external links and the Google
  Analytics measurement ID.
- **`sonarcloud.yml`** - on PR and on push to `master`: runs the Vitest suite with coverage and
  feeds it to a SonarCloud scan; on PRs it also posts a comment with the overall coverage
  percentage and a per-file breakdown (SonarCloud's own PR comment only covers new/changed
  lines).
- **`auto-merge-dependabot.yml`** - see below.

Example:

![cicd](.github/images/cicd.png)

### Dependabot 🤖

`dependabot.yml` bumps npm dependencies on a daily schedule (08:00 Brussels time), opening one PR
per update (`vitest`/`@vitest/*` are grouped into a single PR) with `rebase-strategy: auto` so
Dependabot keeps branches up to date itself.

The `auto-merge-dependabot.yml` workflow then merges those PRs automatically once their checks
pass. It triggers as soon as the `Build and Deploy` workflow finishes on a Dependabot branch
(`workflow_run`), with a periodic run every 3 hours as a fallback in case that trigger is ever
missed, plus a manual `workflow_dispatch` trigger. For each open Dependabot PR whose checks are
green, it squash-merges and deletes the branch, then asks Dependabot itself (via an
`@dependabot rebase` comment) to rebase any remaining out-of-date PRs rather than rebasing them
itself - a push from this workflow's own token would show up as an untrusted actor and get gated
behind a manual approval, which would block auto-merge. After merging at least one PR it also
triggers a fresh `build-deploy.yml` run against `master` so the deployment picks up the update.

This ensures dependencies are kept up-to-date automatically while maintaining code quality through automated testing.
