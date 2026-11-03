terraform {
  required_version = ">= 1.8.0"

  required_providers {
    github = {
      source  = "integrations/github"
      version = "~> 6.6"
    }
    vercel = {
      source  = "vercel/vercel"
      version = "~> 3.0"
    }
  }

  encryption {
    key_provider "pbkdf2" "passphrase" {
      passphrase = var.state_passphrase
    }

    method "aes_gcm" "passphrase" {
      keys = key_provider.pbkdf2.passphrase
    }

    state {
      method   = method.aes_gcm.passphrase
      enforced = true
    }

    plan {
      method   = method.aes_gcm.passphrase
      enforced = true
    }
  }
}

provider "github" {
  owner = var.github_owner
}

provider "vercel" {
  team = var.vercel_team
}
