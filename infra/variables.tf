variable "state_passphrase" {
  type        = string
  sensitive   = true
  description = "Passphrase that encrypts the local state and plan files (at least 16 characters)."

  validation {
    condition     = length(var.state_passphrase) >= 16
    error_message = "state_passphrase must be at least 16 characters."
  }
}

variable "resources_repo_token" {
  type        = string
  sensitive   = true
  description = "Fine-grained PAT with Contents: Read-only on portfolio-resources."
}

variable "github_owner" {
  type    = string
  default = "velizartodorov"
}

variable "github_repository" {
  type    = string
  default = "velizartodorov.github.io"
}

variable "vercel_team" {
  type    = string
  default = "velizar"
}

variable "vercel_project" {
  type    = string
  default = "velizartodorov-github-io"
}
