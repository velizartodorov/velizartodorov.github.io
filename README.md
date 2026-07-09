# Velizar's portfolio 👨‍💼

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
directory. Each language (en, nl) has its own set of translation files, assembled at build time
into a single `resources` object per language (`en.ts` / `nl.ts`).

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
  - `build-resources.ts` - assembles an index file plus its Markdown entries into the final
    `{ title, list }` shape consumed by the app
  - `completeness.test.ts` - Vitest check that every key path present in `en`'s resources also
    exists in `nl` (and vice versa), so a missing translation fails the build instead of silently
    falling back

Markdown frontmatter is parsed at build time by `loaders/markdown-frontmatter-loader.cjs`
(via `gray-matter`), which turns each `.md` file into a JS module exporting its frontmatter
fields plus a `body` string.

## CI/CD 🚀

### Github Workflows 🏭

The custom `build-deploy.yml` workflow makes sure that:

- when opening a PR the application will be built with clean dependencies
- when pushing to `master`, it will be automatically deployed

Example:

![cicd](.github/images/cicd.png)

### Dependabot 🤖

`dependabot.yml` will make sure that bumping of library happens on a regular
basis by Dependabot with automatic opening of a PR (daily, 08:00 Brussels time).

The `auto-merge-dependabot.yml` workflow merges Dependabot PRs automatically once their checks
pass: it triggers as soon as the `Build and Deploy` workflow finishes on a Dependabot branch,
with a periodic run every 3 hours as a fallback in case that trigger is ever missed.

This ensures dependencies are kept up-to-date automatically while maintaining code quality through automated testing.
