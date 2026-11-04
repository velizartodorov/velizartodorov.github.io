import {
  to = github_repository.portfolio
  id = var.github_repository
}

resource "github_repository" "portfolio" {
  name         = var.github_repository
  description  = ""
  homepage_url = "https://${var.github_repository}/"
  visibility   = "public"
  topics       = []

  has_issues      = false
  has_projects    = false
  has_wiki        = false
  has_discussions = false
  allow_forking   = true

  allow_merge_commit          = true
  allow_squash_merge          = true
  allow_rebase_merge          = true
  allow_auto_merge            = true
  allow_update_branch         = true
  delete_branch_on_merge      = true
  merge_commit_title          = "MERGE_MESSAGE"
  merge_commit_message        = "PR_TITLE"
  squash_merge_commit_title   = "COMMIT_OR_PR_TITLE"
  squash_merge_commit_message = "COMMIT_MESSAGES"
  web_commit_signoff_required = false

  archive_on_destroy = true

  security_and_analysis {
    secret_scanning {
      status = "enabled"
    }
    secret_scanning_push_protection {
      status = "enabled"
    }
  }

  lifecycle {
    prevent_destroy = true
  }
}

import {
  to = github_repository_vulnerability_alerts.portfolio
  id = var.github_repository
}

resource "github_repository_vulnerability_alerts" "portfolio" {
  repository = github_repository.portfolio.name
  enabled    = true
}

import {
  to = github_repository_dependabot_security_updates.portfolio
  id = var.github_repository
}

resource "github_repository_dependabot_security_updates" "portfolio" {
  repository = github_repository.portfolio.name
  enabled    = true
}

import {
  to = github_repository_ruleset.require_build_on_master
  id = "${var.github_repository}:18712903"
}

resource "github_repository_ruleset" "require_build_on_master" {
  repository  = var.github_repository
  name        = "Require build check on master"
  target      = "branch"
  enforcement = "active"

  conditions {
    ref_name {
      include = ["refs/heads/master"]
      exclude = []
    }
  }

  rules {
    required_status_checks {
      strict_required_status_checks_policy = false
      do_not_enforce_on_create             = false

      required_check {
        context = "build"
      }
    }
  }
}

import {
  to = github_issue_label.auto_rebase
  id = "${var.github_repository}:auto-rebase"
}

resource "github_issue_label" "auto_rebase" {
  repository  = var.github_repository
  name        = "auto-rebase"
  color       = "0E8A16"
  description = "Rebase this PR onto master automatically whenever master moves"
}
