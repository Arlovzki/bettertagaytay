resource "aws_amplify_branch" "transparency" {
  app_id            = aws_amplify_app.site.id
  branch_name       = "transparency"
  framework         = "React"
  stage             = "PRODUCTION"
  enable_auto_build = false
}

# Manage all existing domain mappings together so adding the portal preserves
# the main site's apex and www destinations.
import {
  to = aws_amplify_domain_association.site
  id = "d2hrjmoigt8q4w/bettertagaytay.org"
}

resource "aws_amplify_domain_association" "site" {
  app_id                 = aws_amplify_app.site.id
  domain_name            = "bettertagaytay.org"
  enable_auto_sub_domain = false
  wait_for_verification  = false

  certificate_settings {
    type = "AMPLIFY_MANAGED"
  }

  sub_domain {
    branch_name = "main"
    prefix      = ""
  }

  sub_domain {
    branch_name = "main"
    prefix      = "www"
  }

  sub_domain {
    branch_name = aws_amplify_branch.transparency.branch_name
    prefix      = "transparency"
  }

  lifecycle {
    prevent_destroy = true
  }
}

output "transparency_preview_url" {
  value = "https://${aws_amplify_branch.transparency.branch_name}.${aws_amplify_app.site.default_domain}"
}

output "custom_domain_dns_records" {
  value = aws_amplify_domain_association.site.sub_domain
}
