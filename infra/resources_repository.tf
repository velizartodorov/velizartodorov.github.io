import {
  to = github_repository.resources
  id = var.github_resources_repository
}

resource "github_repository" "resources" {
  name        = var.github_resources_repository
  description = ""
  visibility  = "private"
  topics      = []

  has_issues      = true
  has_projects    = true
  has_wiki        = false
  has_discussions = false
  allow_forking   = true

  allow_merge_commit          = true
  allow_squash_merge          = true
  allow_rebase_merge          = true
  allow_auto_merge            = false
  allow_update_branch         = false
  delete_branch_on_merge      = false
  merge_commit_title          = "MERGE_MESSAGE"
  merge_commit_message        = "PR_TITLE"
  squash_merge_commit_title   = "COMMIT_OR_PR_TITLE"
  squash_merge_commit_message = "COMMIT_MESSAGES"
  web_commit_signoff_required = false

  archive_on_destroy = true

  lifecycle {
    prevent_destroy = true
  }
}

import {
  to = github_workflow_repository_permissions.resources
  id = var.github_resources_repository
}

resource "github_workflow_repository_permissions" "resources" {
  repository                       = github_repository.resources.name
  default_workflow_permissions     = "read"
  can_approve_pull_request_reviews = false
}
