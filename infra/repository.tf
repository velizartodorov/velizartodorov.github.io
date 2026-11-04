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
