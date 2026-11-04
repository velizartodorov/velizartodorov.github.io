# Infra 🔐

[OpenTofu](https://opentofu.org) config that holds every CI token for this site in one local file
and pushes each one to wherever it's needed:

| Token | Pushed to | What it is | Breaks when it expires |
|---|---|---|---|
| `resources_repo_token` | `RESOURCES_REPO_TOKEN`: Actions + Dependabot secrets here, Vercel env var (Production, Preview, Development) | Fine-grained PAT on `portfolio-resources`, `Contents: Read-only` | Every build, SonarCloud and Vercel deploy (submodule fetch fails with `Authentication failed`) |
| `auto_rebase_token` | `AUTO_REBASE_TOKEN`: Actions secret here | Fine-grained PAT on `velizartodorov.github.io`, `Contents` + `Pull requests: Read and write` | `auto-rebase.yml` stops rebasing `auto-rebase`-labelled PRs |
| `sonar_token` | `SONAR_TOKEN`: Actions secret here | SonarCloud token (My Account → Security) | `sonarcloud.yml`'s scan step |
| `portfolio_repo_token` | `PORTFOLIO_REPO_TOKEN`: Actions secret on `portfolio-resources` | Fine-grained PAT on `velizartodorov.github.io`, `Contents` + `Pull requests: Read and write` | `portfolio-resources`' `sync-to-public.yml` opens no bump PR |

The tokens themselves are still created by hand — GitHub has no API for minting personal access
tokens. Give each one an expiry you'll notice, and note the dates next to the passphrase.

It also manages the repo settings that otherwise only exist in GitHub's UI:

| File | Resource | Setting |
|---|---|---|
| [repository.tf](repository.tf) | `github_repository.portfolio` | Description, homepage, features (issues/wiki/projects off), merge buttons (squash and rebase only — merge commits off), auto-merge, delete branch on merge, **secret scanning + push protection on**. `prevent_destroy` and `archive_on_destroy` make sure OpenTofu can never delete the repo. |
| | `github_repository_vulnerability_alerts`, `github_repository_dependabot_security_updates` | Dependabot alerts and security-update PRs on |
| | `github_repository_ruleset.require_build_on_master` | `build` must pass before merging to `master`, no bypass |
| | `github_repository_ruleset.protect_master` | `master` can't be deleted or force-pushed, and only takes changes through PRs merged with **squash or rebase** (0 approvals required), no bypass |
| | `github_issue_label.auto_rebase` | The label `auto-rebase.yml` selects PRs by |
| [actions.tf](actions.tf) | `github_workflow_repository_permissions` | `GITHUB_TOKEN` defaults to **read**; every workflow declares the extra `permissions:` it needs |
| | `github_actions_repository_permissions` | Actions on, any action allowed (`davelosert/vitest-coverage-report-action` isn't from a verified creator, so restricting would break `sonarcloud.yml`) |
| [pages.tf](pages.tf) | `github_repository_pages` | Pages built by the `build-deploy.yml` workflow |
| | `github_repository_environment.github_pages` + `..._deployment_policy.master` | Only `master` can deploy to the `github-pages` environment |

For `portfolio-resources`, [resources_repository.tf](resources_repository.tf) manages the repo
itself — chiefly to pin **`visibility = "private"`**, so a stray switch to public (which would
expose the CV content) shows up as drift and is reverted — plus its read-only `GITHUB_TOKEN`
default. It's a private repo on the free plan, so GitHub offers it no rulesets, branch
protection or secret scanning to manage.

All of these were adopted with `import` blocks, so the first apply takes them over instead of
recreating them. Change them here, not in the UI — a UI edit shows up as drift on the next
`tofu plan` and gets reverted by the next `tofu apply`.

Left out on purpose: the `Preview`/`Production` environments (created by Vercel's GitHub
integration), the `copilot` environment (created by Copilot's coding agent), CodeQL default
setup (no provider resource), and GitHub's default labels.

## Prerequisites

- OpenTofu `>= 1.8` (`winget install OpenTofu.Tofu`, `brew install opentofu`, …).
- GitHub auth: a logged-in `gh` CLI (the provider falls back to `gh auth token`), or a
  `GITHUB_TOKEN` with admin rights on both `velizartodorov.github.io` and `portfolio-resources`.
- Vercel auth: `VERCEL_API_TOKEN` set to a token from
  [vercel.com/account/tokens](https://vercel.com/account/tokens) scoped to the `velizar` team.

## Setup

```bash
cd infra
cp terraform.tfvars.example terraform.tfvars
```

Fill in `terraform.tfvars` (gitignored) before `tofu init` — init already needs the passphrase:

- `state_passphrase` — 16+ characters; encrypts `terraform.tfstate` and plan files with AES-GCM.
  Keep it in your password manager: without it the state can't be read and you'd have to
  re-import everything.
- One value per token in the table above.

```bash
tofu init
```

## First apply: adopt the existing values

All of these already exist. The GitHub secrets are simply overwritten, but Vercel rejects a
second variable with the same key, so adopt it first. Either delete `RESOURCES_REPO_TOKEN` in
Vercel → Project → Settings → Environment Variables right before the first apply, or import it:

```bash
tofu import vercel_project_environment_variable.resources_repo_token <project_id>/<env_var_id>
```

`<project_id>` (`prj_…`) is under Vercel → Project → Settings → General. `<env_var_id>` comes from
the [project env vars API](https://vercel.com/docs/rest-api/endpoints/projects#retrieve-the-environment-variables-of-a-project-by-id-or-name)
or the browser's network tab on the Environment Variables page.

Then:

```bash
tofu apply
```

## Rotating a token

1. Regenerate it (GitHub → Settings → Developer settings → Personal access tokens, or
   SonarCloud → My Account → Security) with the same scope as in the table.
2. Update its value in `terraform.tfvars`.
3. `tofu apply` — every place that token lives updates at once.
4. For `resources_repo_token`, redeploy the latest Vercel deployment; env var changes only reach
   new builds.

## State

State lives locally in `infra/terraform.tfstate`, encrypted with `state_passphrase`
(`enforced = true`, so OpenTofu refuses to write it unencrypted). It's gitignored anyway —
never commit it, and keep a backup next to the passphrase.
