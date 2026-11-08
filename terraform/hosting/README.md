# Existing Amplify hosting

This Terraform root adopts the existing manual-hosting app, `d2hrjmoigt8q4w`, in `ap-southeast-1`. It manages the app settings and SPA rewrite, with destruction prevented. The `main` branch and custom domain associations remain on the existing app.

```sh
AWS_PROFILE=arloubeloria terraform -chdir=terraform/hosting init
AWS_PROFILE=arloubeloria terraform -chdir=terraform/hosting plan -out=hosting.tfplan
AWS_PROFILE=arloubeloria terraform -chdir=terraform/hosting apply hosting.tfplan
```

Review the plan before applying. The initial adoption changes only the SPA rewrite to let WebP assets load directly. Other app settings match the existing configuration.

The frontend is deployed using the manual Amplify build-artifact workflow in `CLAUDE.md`. Package the contents of `dist/`, with `index.html` at the ZIP root. Do not include Terraform state, source credentials or environment files in that archive.

Keep local Terraform state secure and backed up. State, plans and provider downloads are excluded from Git; the provider lockfile is retained.
