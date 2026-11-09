# Tagaytay Transparency Portal

An independent BetterTagaytay portal for national budget entries naming Tagaytay,
with proposal comparisons, historical appropriations, CSV exports and source links.
The separate City finances page summarizes official Tagaytay financial disclosures.
Intended address: https://transparency.bettertagaytay.org.

## Run and verify

Use Node 22.12+ and npm. From the repository root:

```sh
npm ci --prefix apps/transparency
npm run dev:transparency
npm run build:transparency
npm run lint --prefix apps/transparency
npm test --prefix apps/transparency
npm run check --prefix apps/transparency -- --verbose
```

The local portal runs at http://127.0.0.1:5132. Its production files are in
`apps/transparency/dist/`. It is separate from the main civic website on port 5173.

## Coverage and data integrity

`portal.config.ts` searches the [BetterGov.ph Budget API](https://budget.bettergov.ph/docs):

- 2027 proposal titles naming Tagaytay in IV-A, plus records without a region,
  across DPWH, farm-to-market roads, health facilities and irrigation.
- Historical GAA program names across every department, from 2020 through 2026.
- No district engineering office's entire budget. Shared offices cover other cities.
- Explicit exclusions in `src/data/exclusions.json`, published on `/about` with reasons.

Connecting roads can include funded sections outside Tagaytay City. Totals describe
the matching titles after exclusions. They are not the city's own budget, a complete
geographic inventory, releases, payments or completed projects. The NEP and House
versions are compared, never added. Missing amounts remain distinct from zero.
Unconfirmed matches and comparison candidates retain the API's labels and notices.

The initial scope review on 8 November 2026 found 48 proposal entries and 359
historical program families. It excluded one 2027 namesake in Quezon and 55 historical
namesakes or pooled allocations that cannot be attributed to the city. The proposal
snapshot was built on 26 October 2026. These counts can change with the API.

Run the live scope check before a release and after updating exclusions. It checks
pagination, duplicate keys, amounts and all historical department/year totals against
the API. The expected warning about title-only records outside configured offices
does not authorize including an entire shared office's budget. Review the titles.

## Storage and reports

This application has no database and no API credentials. The browser fetches public
BetterGov data directly; successful requests are cached in memory for the page
session. Configuration, exclusions, code and branding live in this repository.
Amplify hosts the compiled static files. CSV files are generated in the browser.

Correction links open an email to `arloubeloria@gmail.com` with the project reference
and page URL. No report is submitted until the visitor sends the email through their
own mail app. The upstream central reporting service remains disabled.

## Official city finances

`/city-finances` keeps city returns separate from national proposals. Year and
period selectors use the headings inside the PDFs, not upload-folder dates. The
26 checked returns cover 2016 Q1–Q4; 2017 Q1 and annual; 2018 annual; 2019 Q1 and
annual; 2021 and 2022 annual; 2023–2025 Q1–Q4; and 2026 Q1–Q3. Gaps are not zero.

`src/data/city-finances.json` stores manual transcriptions in integer centavos,
source pages, reporting notes and SHA-256 fingerprints. The 23 checked PDF copies
live in `public/city-finances/`. OCR was a reading aid only; reviewed values were
checked visually, including the original embedded bitmap for the faint 2025 Q4
scan. The 2018 expenditure total was checked at full size to distinguish an OCR
misreading of one digit.

Each period preserves its source layout. Operating income, operating expenditure,
capital expenditure, total receipts and total expenditure are different measures.
No trend, change or grand total is calculated across returns. Older current-year
semester totals exclude the prior-year actual and budget-year columns. Repeated
copies are counted once. The 2016 PDF also contains Q1 2017; the 2020-directory PDF
covers 2019, the 2022-directory PDF covers 2021, and the 2023-directory annual PDF
covers 2022. Q1 2023 has conflicting outer/inner period labels, disclosed on the page.

The 2017 annual return's separate continuing-appropriation actual-expenditure row
is explained without silently adding it to the printed Total Expenditures row.
The Q1 2019 PDF contains receipts only. Its missing expenditure total stays null.
Q1 2023 capital cells contain dashes, also retained as null. “Not stated in report”
means no numeric amount appears in that field; it does not mean zero or prove that
work has not started.

The Development Fund view is at `/city-finances?report=development`. It covers
50 reviewed reports from Q1 2014 to Q3 2026. The city lists one more report, Q3
2021, whose PDF returns 404. The period selector shows that gap without
substituting another report. The PDF filed under Q4 2020 covers the full calendar
year; its totals are on page 2.

`src/data/city-development.json` stores the checked amounts, source pages,
reporting notes and components of calculated sums. It reuses the checked Q3 2026
PDF and adds 49 files in `public/city-finances/development/`. Keep printed totals,
calculated sums, appropriations and amounts incurred distinct. Do not add a
programme amount to an overlapping lot entry, treat a continuing appropriation as
a payment, or turn a blank cell into zero. Only Q3 2026 has a full project table;
the other summaries link to the original rows in the PDFs.

The library indexes 207 published links: all PDF links in the 2023–2026 listings
plus older receipts/expenditure and development-fund reports. Of these, 205
returned PDFs; the Q4 2025 SIPB and Q3 2021 Development Fund links returned 404.
Library search/year/quarter/type filters do not change the selected summary. Lists
load 24 documents at a time. Both summary selection and library filters use URLs.

Refresh links with `python3 apps/transparency/scripts/refresh-city-documents.py` from
the repository root. It uses three concurrent HEAD requests, retries transient
failures and separates unavailable links. It does not refresh financial summaries.
Inspect source pages, periods and columns before changing a transcription. Run the
reconciliation, provenance and hosting tests, then verify the rendered page and
live PDF hashes. City summaries work independently of the national Budget API.

## Hosting

AWS Amplify app `d2hrjmoigt8q4w`, branch `transparency`, region `ap-southeast-1`.
The main website uses branch `main`; deploy each artifact to its own branch.
Branch and custom-domain mappings are managed in `terraform/hosting/transparency.tf`.
Namecheap DNS requires CNAME host `transparency` pointing to the CloudFront target
returned by Amplify. See the hosting Terraform README for the current record.

Build and check above, then zip the contents of `apps/transparency/dist/`
with `index.html` at the archive root. Use Amplify's manual `create-deployment`,
upload and `start-deployment` workflow for branch `transparency`. The app's existing
SPA rewrite serves extensionless deep links through `index.html`.

## Foundation and attribution

Adapted from [BetterGov.ph's transparency portal](https://github.com/bettergovph/transparency-portal)
at commit `cc65e379e0dfd14ed3020ea2d322cab0403b86c3` under the MIT license.
The original license remains in `LICENSE` and `public/LICENSE.txt`; the app keeps
BetterGov's visible data credit and API notices. Upstream API, deployment, setup
and reporting documentation remains in `docs/` for maintenance.

Tagaytay uses DM Sans, Manrope, lake blue and the civic site's elevation contour
asset. Terrain sources and processing metadata are published in
`public/brand/terrain-attribution.txt` and `public/brand/terrain.json`.

The homepage includes a licensed Taal Lake photograph with visible source and
CC BY-SA 4.0 attribution, plus the API's Cavite 8th District representative
portrait and House source credit. The district card is context only: it does not
add the office's entire budget to the city's title-based query. Office histories
remain hidden unless an office is explicitly added to the scope.

The footer keeps the independent-site notice and data date visible. Full API
notices and source/terrain/license credits remain available in an expandable
section. The homepage's comparison notices are also expandable; `/about` retains
the full methodology and notices.

## Making sense

The homepage's `#making-sense` section explains proposal versions, enacted budgets,
amount abbreviations and comparison status with plain-English summaries.
The portal uses English only. The category chart includes only entries with a House bill amount.
Each entry belongs to one title/program-derived category; these are not official
sector codes. Unknown titles remain in Other, and uncertain matches stay labelled.

`src/lib/insights.ts` owns the category rules and totals. Category links select
both a project type and House entries in the detailed table; CSV exports follow
those filters and add a `project_type` column. Full category rules are published
on `/about`. Unit tests cover category precedence, totals, missing amounts,
uncertain matches and empty/zero data. A mutation check confirmed that the tests
fail if NEP-only entries are incorrectly included in the House chart.

The [reference review](../../docs/transparency-portal-reference-review.md) records
the supplied peer portals and the decisions used here.
