# Service guides and document library

This release implements the first three priorities from the Better LGU comparison: five consistent service guides, direct homepage tasks, and a searchable public-document library. It builds on the website audit changes in this checkout.

## Included

- Five guides cover new business permits, business-permit renewal, building permits, scholarships, and senior citizen/PWD/solo parent assistance. Existing URLs are preserved.
- Each guide has an office overview, location, fee and turnaround information, official forms where available, a preparation checklist, a source date, a print action, and a correction-email draft.
- The homepage links directly to these five guides and a filtered forms library. The library is also linked from the hero, Transparency navigation, and footer.
- `/documents` searches 48 official PDFs, with filters for type, year, and quarter, plus incremental results and empty/invalid-filter states. Search and filters live in the URL and survive refresh.
- Dropdowns retain native select behavior and use consistently inset Lucide chevrons. The icons are centered and 12 pixels from the control’s right edge.
- Correction links open an email draft to the owner-approved `arloubeloria@gmail.com`, with the guide title and production page URL. The action uses the visitor’s email application.

## Content and sources

The five original guides contained mismatched or unsupported material, including a partnership-registration guide under the business-permit task and Cebu scholarship references in the Tagaytay scholarship page. These were replaced with Tagaytay-specific material and official sources checked on 6 November 2026.

Sources include the official 2025 Citizen’s Charter, the city’s Business Permit and Licensing page, its building-permit checklist and downloads page, City College of Tagaytay scholarship/admissions/contact pages, and DSWD’s solo-parent registration guidance. The 2025 Charter’s cover and relevant permit pages, along with the building checklist, were inspected. The city website and Charter provide differing permit processing estimates, so the guides ask residents to confirm the release date with the receiving office.

All 48 library links responded successfully as PDFs when rechecked on 6 November 2026. Years and quarters follow source listings or an explicitly dated document. Undated files have no invented year. File availability checks do not verify the financial contents of the records.

The interfaces support English and Filipino. The five guide bodies and their office metadata are currently English and show the existing Filipino fallback notice when Filipino is selected. Full translation remains future work.

## Maintenance

- Guide bodies: existing Markdown files under `content/services/`.
- Overview/checklist/form metadata: the companion JSON file’s `guide` object. The loader retains the existing JSON interpolation behavior for other documents.
- Library catalogue: `src/data/documents.json`. Each record retains its official source URL and link-check date. This is a curated catalogue; no scheduled synchronization was added.
- Homepage tasks: `src/data/popularTasks.ts`.
- Correction recipient: `src/data/siteContact.json`, with optional build-time override `VITE_CORRECTION_EMAIL`.

The features use repository content and do not require a new database or account system. The existing visit counter remains separate in DynamoDB.

## Verification and release

TypeScript/build, ESLint, and the focused Node tests pass. Browser checks cover combined filters, refresh, empty results, invalid filters, incremental results, all five guide pages, preparation checkboxes, English/Filipino labels, email recipient/subject/body, and mobile layouts. The email draft was inspected without sending a report. Print styling was added; a physical printout was not verified.

The frontend was deployed on 6 November 2026 through the existing Amplify app. The hosting rewrite was updated through Terraform to serve the new WebP images directly. No Git commit or push was made. See the [production release record](production-release-2026-11-06.md). The remaining audit findings in `docs/website-audit.md` still apply to other content and dependencies.
