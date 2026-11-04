import {
  to = github_workflow_repository_permissions.portfolio
  id = var.github_repository
}

resource "github_workflow_repository_permissions" "portfolio" {
  repository                       = github_repository.portfolio.name
  default_workflow_permissions     = "read"
  can_approve_pull_request_reviews = false
}

import {
  to = github_actions_repository_permissions.portfolio
  id = var.github_repository
}

resource "github_actions_repository_permissions" "portfolio" {
  repository           = github_repository.portfolio.name
  enabled              = true
  allowed_actions      = "all"
  sha_pinning_required = false
}
