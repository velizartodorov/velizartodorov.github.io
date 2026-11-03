locals {
  resources_repo_token_name = "RESOURCES_REPO_TOKEN"
}

resource "github_actions_secret" "resources_repo_token" {
  repository      = var.github_repository
  secret_name     = local.resources_repo_token_name
  plaintext_value = var.resources_repo_token
}

resource "github_dependabot_secret" "resources_repo_token" {
  repository      = var.github_repository
  secret_name     = local.resources_repo_token_name
  plaintext_value = var.resources_repo_token
}

data "vercel_project" "portfolio" {
  name = var.vercel_project
}

resource "vercel_project_environment_variable" "resources_repo_token" {
  project_id = data.vercel_project.portfolio.id
  key        = local.resources_repo_token_name
  value      = var.resources_repo_token
  target     = ["production", "preview", "development"]
}
