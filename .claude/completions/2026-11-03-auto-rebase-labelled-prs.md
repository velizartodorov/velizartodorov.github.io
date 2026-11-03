# Auto-rebase labelled PRs

Added `.github/workflows/auto-rebase.yml`. On every push to `master` (or a manual
dispatch), the workflow finds each open, same-repo PR against `master` that has the
`auto-rebase` label. If the PR is behind `master`, the workflow runs
`gh pr update-branch --rebase` on it. A failed rebase, usually a conflict, posts a
comment on the PR.

The workflow authenticates with an `AUTO_REBASE_TOKEN` PAT secret instead of
`GITHUB_TOKEN`. Pushes made with the workflow token don't trigger the PR's CI, or get
gated as `action_required` (see PR #338), so the required `build` check would never
report on the rebased head.

The workflow can only be verified after the PR merges and the secret is set.
