locals {
  actions_secret_repositories = {
    RESOURCES_REPO_TOKEN = var.github_repository
    AUTO_REBASE_TOKEN    = var.github_repository
    SONAR_TOKEN          = var.github_repository
    PORTFOLIO_REPO_TOKEN = var.github_resources_repository
  }

  actions_secret_values = {
    RESOURCES_REPO_TOKEN = var.resources_repo_token
    AUTO_REBASE_TOKEN    = var.auto_rebase_token
    SONAR_TOKEN          = var.sonar_token
    PORTFOLIO_REPO_TOKEN = var.portfolio_repo_token
  }
}

resource "github_actions_secret" "this" {
  for_each = local.actions_secret_repositories

  repository      = each.value
  secret_name     = each.key
  plaintext_value = local.actions_secret_values[each.key]
}

resource "github_dependabot_secret" "resources_repo_token" {
  repository      = var.github_repository
  secret_name     = "RESOURCES_REPO_TOKEN"
  plaintext_value = var.resources_repo_token
}

data "vercel_project" "portfolio" {
  name = var.vercel_project
}

resource "vercel_project_environment_variable" "resources_repo_token" {
  project_id = data.vercel_project.portfolio.id
  key        = "RESOURCES_REPO_TOKEN"
  value      = var.resources_repo_token
  target     = ["production", "preview", "development"]
}
