# Production release, 6 November 2026

Deployed to [BetterTagaytay](https://bettertagaytay.org/) through the existing AWS Amplify app. The www domain and Amplify default domain also serve the release.

## Release identity

- Amplify app: `d2hrjmoigt8q4w`, region `ap-southeast-1`.
- Amplify target and GitHub default branch: `main`.
- Manual deployment job: `11`, status `SUCCEED`.
- Deployment completed: 6 November 2026, 01:58:31 PHT.
- Artifact: 101 files, 9,468,643 bytes, with `index.html` at the ZIP root.
- Artifact SHA-256: `559d4ee281c20a42de6b6a1b830e6ea29c5b6f0cbfb7f24a3dfc4f9c4c83cd28`.
- Source baseline: `9b284a6d7e985935ddb36a32f06eff630e054ca6`, including the approved local changes. This was an artifact deployment; no Git commit or push was made.

The release includes the audit fixes, shared visit counter, five service guides, 48-document library, correction email, Tagaytay visual identity, real elevation contour background, and visible sticky header with footer ridge blending.

## Hosting change

The existing Amplify app was adopted into `terraform/hosting/`. Terraform imported one resource and updated only its SPA rewrite to exclude WebP assets. No resources were added or destroyed. Configuration validation passed. The visit counter continues to store totals in the existing DynamoDB table, `bettertagaytay-visits`.

## Verification

- All 16 focused tests, ESLint and the production build passed before upload.
- Eleven public URL checks returned HTTP 200, the expected content types and bytes matching the built release: apex, www, Amplify default domain, current JavaScript, WebP photo, contour SVG, public configuration, both interface locale files, and two direct SPA routes.
- Browser checks confirmed the homepage photo and contours load, the business guide opens, and its correction draft addresses `arloubeloria@gmail.com` with the guide's production URL. No report was sent.
- The library displayed all 48 documents. Combining financial reports, 2026 and Quarter 3 returned nine documents and preserved the filters in the URL.
- The shared visit counter displayed a recorded visit. The sticky header remained visible at the bottom of the page. No browser console errors were recorded during these checks.

Full assistive-technology and physical print checks remain outside this release's verification scope. Existing content limitations are listed in the [website audit](website-audit.md).

## Contour reference follow-up

Amplify job `12` succeeded at 02:07:51 PHT on the same day. It adds a discreet linked source reference above the homepage title, with the contour interval and USGS / Mapzen credit in both interface languages. No hosting settings changed.

The follow-up artifact contains 101 files and 9,468,809 bytes; SHA-256: `5066636d36a054a5c2c74ca00aca929a583dd60ba0040bf73b78294a35e3b962`. The build, scoped ESLint, formatting and whitespace checks passed. Browser checks confirmed the 12 px reference, source link, Filipino translation and no horizontal overflow at 375 px. The production homepage, current JavaScript and both locale files matched the built release, and the reference was verified visibly on the public site.

## Public sports release on 8 November

Amplify job `13` succeeded at 22:16:19 PHT on 8 November 2026, using the existing `main` deployment target. The release adds the Sports & exercise directory with seven public entries, English/Filipino content, activity/search filters, source dates and correction email links. Private gyms and clubs are excluded.

The artifact has 104 files and 9,474,629 bytes. SHA-256: `475884046da6dd4cb42b71726fb1ea3837e1dd7da430dcf1234c3818d953ebbd`. The production build and lint passed after the public-only change. Browser checks confirmed seven public entries, no private venues or private-only activity filters, and one result for Running. Five production URL checks matched the release bytes.
