# Existing Amplify hosting

This Terraform root adopts the existing manual-hosting app, `d2hrjmoigt8q4w`, in `ap-southeast-1`. It manages the app settings, SPA rewrite, transparency branch and custom domain association, with app and domain destruction prevented. The apex and www destinations continue to use the existing `main` branch.

```sh
AWS_PROFILE=arloubeloria terraform -chdir=terraform/hosting init
AWS_PROFILE=arloubeloria terraform -chdir=terraform/hosting plan -out=hosting.tfplan
AWS_PROFILE=arloubeloria terraform -chdir=terraform/hosting apply hosting.tfplan
```

Review the plan before applying. The SPA rewrite lets WebP photographs and PDF
source documents load directly, while extensionless routes load the app. Other app
settings match the existing configuration.

The frontend is deployed using the manual Amplify build-artifact workflow in `CLAUDE.md`. Package the contents of `dist/`, with `index.html` at the ZIP root. Do not include Terraform state, source credentials or environment files in that archive.

Keep local Terraform state secure and backed up. State, plans and provider downloads are excluded from Git; the provider lockfile is retained.

## Transparency portal

`transparency.tf` adds an independent manual-hosting branch named `transparency`.
Deploy only `apps/transparency/dist/` to that branch. Its fallback URL is
https://transparency.d2hrjmoigt8q4w.amplifyapp.com.

The existing domain association is imported and all three mappings are managed
together: apex and www to `main`, transparency to `transparency`. The reviewed initial
plan imports one domain, creates one branch and updates the domain in place, with
zero resources destroyed. No main-site artifact is uploaded by this change.

Namecheap manages DNS. The portal record supplied by Amplify is:

| Type  | Host         | Target                        | TTL       |
| ----- | ------------ | ----------------------------- | --------- |
| CNAME | transparency | d3iwh1qpr2itog.cloudfront.net | Automatic |

Preserve the existing apex, www and ACM validation records. Check Amplify's current
domain status after a DNS change and verify HTTPS before declaring the custom
address ready. Query `aws amplify get-domain-association` with profile
`arloubeloria` and region `ap-southeast-1`; don't put credentials or deployment
upload URLs in documentation or state.
