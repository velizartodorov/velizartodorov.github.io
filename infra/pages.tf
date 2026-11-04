import {
  to = github_repository_pages.portfolio
  id = var.github_repository
}

resource "github_repository_pages" "portfolio" {
  repository = github_repository.portfolio.name
  build_type = "workflow"
}

import {
  to = github_repository_environment.github_pages
  id = "${var.github_repository}:github-pages"
}

resource "github_repository_environment" "github_pages" {
  repository        = github_repository.portfolio.name
  environment       = "github-pages"
  can_admins_bypass = true
  wait_timer        = 0

  deployment_branch_policy {
    protected_branches     = false
    custom_branch_policies = true
  }
}

import {
  to = github_repository_environment_deployment_policy.master
  id = "${var.github_repository}:github-pages:29554711"
}

resource "github_repository_environment_deployment_policy" "master" {
  repository     = github_repository.portfolio.name
  environment    = github_repository_environment.github_pages.environment
  branch_pattern = "master"
}
