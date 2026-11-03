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

The resume content and identity-revealing assets (employer/school logos, the certificate PDF,
the personal photo) live in the private
[`portfolio-resources`](https://github.com/velizartodorov/portfolio-resources) repo, mounted as a
git submodule at `src/app/translations/data/`. Its `README.md` covers the content layout, how
this app loads it, and how content updates reach this repo.

Building or running this app locally therefore requires git access to that private repo - there's
no fallback/mock content path. If you're not the maintainer, `npm run dev`/`npm run build` won't
succeed.

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

See [CONTRIBUTING.md](CONTRIBUTING.md) for the branch/commit workflow, local checks, and code style.

## CI/CD 🚀

### Github Workflows 🏭

Three workflows run in `.github/workflows/`. The `build`/`link-check` jobs in `build-deploy.yml`
and the `sonarcloud` job in `sonarcloud.yml` each start with a "Fetch private resources" step
(`node scripts/prepare-resources.mjs`, given the `RESOURCES_REPO_TOKEN` repo secret - a
fine-grained PAT scoped to `portfolio-resources` with `Contents: Read-only`) before installing
dependencies, since the test run itself exercises the private submodule's content. That PAT
expires (fine-grained tokens max out around a year) and needs rotating before then, or every
workflow that touches the submodule breaks. [`infra/`](infra/README.md) pushes a rotated PAT to
the Actions secret, the Dependabot secret, and Vercel with one `tofu apply`. `portfolio-resources` holds a second PAT for its sync
workflow, documented in its own `README.md`.

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
  lines). `sonar-project.properties` excludes `src/app/translations/data/**` (the private
  submodule) from the source scan, so its content is never uploaded to SonarCloud.
- **`auto-merge-dependabot.yml`** - see below.

Vercel also builds a preview deployment for every PR (`npm run build`, triggered by the Vercel
GitHub integration rather than a workflow file here) and needs the same private-repo access;
its `RESOURCES_REPO_TOKEN` project environment variable (Production, Preview, and Development)
holds the same PAT and must be kept in sync with the GitHub repo secret, including after
rotation.

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

## License 📄

The code in this repo is licensed under the [MIT License](LICENSE). The resume content and assets
in the private `portfolio-resources` submodule are not covered by it.
