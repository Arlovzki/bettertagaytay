terraform {
  required_version = ">= 1.5"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "6.72.0"
    }
  }
}

provider "aws" {
  region              = "ap-southeast-1"
  allowed_account_ids = ["100024683088"]
}

# Adopt the existing manual-hosting app; do not create a second deployment target.
import {
  to = aws_amplify_app.site
  id = "d2hrjmoigt8q4w"
}

resource "aws_amplify_app" "site" {
  name                        = "bettertagaytay"
  platform                    = "WEB"
  enable_branch_auto_build    = false
  enable_branch_auto_deletion = false
  enable_auto_branch_creation = false
  enable_basic_auth           = false

  cache_config {
    type = "AMPLIFY_MANAGED_NO_COOKIES"
  }

  job_config {
    build_compute_type = "STANDARD_8GB"
  }

  # Keep the hostname, sitemap, and page canonicals consistent.
  custom_rule {
    source = "https://www.bettertagaytay.org"
    target = "https://bettertagaytay.org"
    status = "301"
  }

  # Project pages fetch live data. Other routes and public files have build output.
  custom_rule {
    source = "</^/projects/(dpwh|fmr|hfep|nia)/[^/]+/?$/>"
    target = "/project-shell.html"
    status = "200"
  }

  custom_rule {
    source = "/<*>"
    target = "/404.html"
    status = "404-200"
  }

  lifecycle {
    prevent_destroy = true
    ignore_changes  = [custom_headers]
  }
}

output "app_id" {
  value = aws_amplify_app.site.id
}
