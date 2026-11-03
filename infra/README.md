# Infra 🔐

[OpenTofu](https://opentofu.org) config that pushes the `RESOURCES_REPO_TOKEN` PAT to the three
places that need it, from one local value:

| Where | Resource |
|---|---|
| GitHub Actions secret | `github_actions_secret.resources_repo_token` |
| GitHub Dependabot secret | `github_dependabot_secret.resources_repo_token` |
| Vercel env var (Production, Preview, Development) | `vercel_project_environment_variable.resources_repo_token` |

The PAT itself is still created by hand — GitHub has no API for minting personal access tokens.
See the root [README.md](../README.md#github-workflows-) for its scope (`portfolio-resources`,
`Contents: Read-only`).

## Prerequisites

- OpenTofu `>= 1.8` (`winget install OpenTofu.Tofu`, `brew install opentofu`, …).
- GitHub auth: a logged-in `gh` CLI (the provider falls back to `gh auth token`), or a
  `GITHUB_TOKEN` with admin rights on this repo.
- Vercel auth: `VERCEL_API_TOKEN` set to a token from
  [vercel.com/account/tokens](https://vercel.com/account/tokens) scoped to the `velizar` team.

## Setup

```bash
cd infra
cp terraform.tfvars.example terraform.tfvars
```

Fill in `terraform.tfvars` (gitignored):

- `state_passphrase` — 16+ characters; encrypts `terraform.tfstate` and plan files with AES-GCM.
  Keep it in your password manager: without it the state can't be read and you'd have to
  re-import everything.
- `resources_repo_token` — the current PAT.

```bash
tofu init
```

## First apply: adopt the existing values

The secrets and the Vercel variable already exist. The GitHub secrets are simply overwritten,
but Vercel rejects a second variable with the same key, so adopt it first. Either delete
`RESOURCES_REPO_TOKEN` in Vercel → Project → Settings → Environment Variables right before the
first apply, or import it:

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

## Rotating the PAT

1. Regenerate the fine-grained PAT on GitHub.
2. Update `resources_repo_token` in `terraform.tfvars`.
3. `tofu apply` — all three places update at once.
4. Redeploy the latest Vercel deployment; env var changes only reach new builds.

## State

State lives locally in `infra/terraform.tfstate`, encrypted with `state_passphrase`
(`enforced = true`, so OpenTofu refuses to write it unencrypted). It's gitignored anyway —
never commit it, and keep a backup next to the passphrase.
