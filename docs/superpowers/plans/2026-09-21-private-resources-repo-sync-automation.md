# Private resources repo — auto-sync automation — Continuation Notes

## Context

`docs/superpowers/specs/2026-09-18-private-resources-repo-design.md` shipped in
[#436](https://github.com/velizartodorov/velizartodorov.github.io/pull/436) (merged to `master`).
Resume content now lives in the private `velizartodorov/portfolio-resources` repo, mounted here
as a git submodule at `src/app/translations/data/`.

Editing content is currently a two-repo workflow: edit + push in the private repo, then
separately bump the submodule pointer in this public repo (documented in this repo's
`README.md`, "How to start locally?"/"Translation files" sections). This plan adds automation so
a push to `portfolio-resources`'s `master` propagates here automatically via an auto-merging PR,
instead of being a manual step to remember.

## Status: mostly done, blocked on one manual credential step

### Done

- `.github/workflows/sync-to-public.yml` added to the **private** repo
  (`velizartodorov/portfolio-resources`, commit `68ae349`), triggered on push to its `master`. On
  every push it:
  1. Checks out the **public** repo (`velizartodorov/velizartodorov.github.io`) using a new
     `PORTFOLIO_REPO_TOKEN` secret.
  2. Re-clones the submodule using the private repo's own built-in `GITHUB_TOKEN` (a workflow
     already has read access to the repo it runs in) — `PORTFOLIO_REPO_TOKEN` therefore only ever
     needs access to the *public* repo, never to `portfolio-resources` itself.
  3. Checks out the exact commit that triggered the run inside that submodule checkout.
  4. If the public repo's recorded submodule pointer actually changed, commits the bump on a new
     branch (`bump-resources-<short-sha>`), opens a PR against `master`, and runs
     `gh pr merge --auto --squash` (relies on the repo's existing "auto-merge enabled" setting and
     required `build` check, same mechanism the Dependabot PRs already use).
- Verified the workflow reaches exactly the credential-check point and fails cleanly with
  `Input required and not supplied: token` — confirms the YAML itself is correct; the only
  missing piece is the secret. (Failed run:
  `gh run view 35548161787 --repo velizartodorov/portfolio-resources`.)

### Remaining steps (blocked on the private repo owner — GitHub only allows fine-grained PAT
creation through its web UI, so this can't be scripted)

1. **Create a new fine-grained PAT** at
   <https://github.com/settings/personal-access-tokens/new>:
   - Repository access: "Only select repositories" → `velizartodorov.github.io` (the **public**
     repo — not `portfolio-resources`)
   - Permissions → Repository permissions: **Contents: Read and write**, **Pull requests: Read
     and write**
   - This is a second, more-privileged PAT alongside the existing read-only
     `RESOURCES_REPO_TOKEN` from the original migration — both need a recurring reminder to
     rotate before they expire (fine-grained PATs max out around a year). See the original
     design spec's "Open questions / follow-ups" section.

2. **Add it as a secret on the private repo:**

   ```bash
   gh secret set PORTFOLIO_REPO_TOKEN --repo velizartodorov/portfolio-resources
   ```

   (paste the token when prompted — not into chat or any file)

3. **Re-run the failed workflow run to confirm end-to-end:**

   ```bash
   gh run rerun 35548161787 --repo velizartodorov/portfolio-resources
   ```

   (or just push any new commit to `portfolio-resources`'s `master` — the next real content edit
   triggers it naturally). Confirm it:
   - Opens a PR against `velizartodorov/velizartodorov.github.io` bumping
     `src/app/translations/data` to `68ae349` (the `sync-to-public.yml` commit itself, since
     that's the first push after this workflow was added).
   - The PR's checks (`build`, `link-check`, `sonarcloud`) go green.
   - Auto-merge lands it without further manual action.

4. Once confirmed working, soften this repo's `README.md` "How to adapt resources" instructions
   to say the pointer bump now happens automatically — a documentation follow-up, not urgent.

## Design decisions made along the way (context for resuming cold)

- Considered Dependabot's `gitsubmodule` package-ecosystem as a simpler, credential-free
  alternative (reuses the existing `dependabot.yml` + `auto-merge-dependabot.yml` infrastructure
  already in this repo). Rejected in favor of instant propagation per explicit request, at the
  cost of a second, more-privileged token to manage. If token upkeep ever becomes annoying,
  revisit that alternative — it needs no new secrets, only a scheduled check.
- `PORTFOLIO_REPO_TOKEN` is deliberately scoped to *only* the public repo, not also to
  `portfolio-resources` — the workflow reuses its own automatic `GITHUB_TOKEN` for the
  self-clone instead, so no single token needs write access to one repo and read access to
  another.
- This repo's `master` branch protection requires the `build` check and has no bypass actors, so
  the automation goes through a PR + auto-merge rather than pushing directly to `master` —
  mirrors the existing Dependabot flow rather than inventing a new one.
