# Markdown PR checks

Removed the Markdown path exclusion from the `pull_request` trigger in
`.github/workflows/build-deploy.yml`. Markdown-only PRs now run the required
`build` check so they can be merged under the `master` ruleset. The `push`
path exclusion remains, so Markdown-only merges do not trigger deployment.

Validated with `git diff --check`. GitHub Actions cannot be verified until the
workflow change is pushed.
