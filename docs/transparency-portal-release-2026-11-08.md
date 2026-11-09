# Tagaytay transparency portal release, 8 November 2026

Live: https://transparency.bettertagaytay.org/

The independent portal uses BetterGov.ph's open-source foundation with
BetterTagaytay branding, national proposal comparisons, historical appropriations,
search and filters, CSV downloads, source-document links and published exclusions.
Correction links open an email to the operator. The application has no database;
it reads the public Budget API from the browser.

## Deployment

- AWS Amplify app: `d2hrjmoigt8q4w`, region `ap-southeast-1`.
- Dedicated branch: `transparency`. Main website artifacts remain on `main`.
- Manual deployment job: `1`, succeeded at 22:48:28 PHT on 8 November 2026.
- Artifact ZIP: 698,548 bytes.
- Artifact SHA-256: `b9fa0f41a32f9b26e8122a6badaecc46e3fba26aeb4bbbe6661af91f073b3b91`.
- Served index SHA-256: `01a77dd8d54093ee8e55bc2758a725c2b67ed7719930418ca7edc58d2e5d2db5`.
- Terraform imported the existing domain association, created the transparency
  branch and added its mapping. The plan destroyed no resources. A subsequent
  plan reported no changes.
- The user added Namecheap's CNAME for `transparency` to
  `d3iwh1qpr2itog.cloudfront.net`. DNS resolves and HTTPS validates normally.

Source work remains uncommitted on `codex/tagaytay-transparency`. This release
does not commit, push or merge Git history.

## Verification

- Strict TypeScript build, including `noUncheckedIndexedAccess`, and Vite build pass.
- Root and transparency-app ESLint checks pass.
- The live scope check passed, reconciling 28 historical department/year totals.
- The downloaded production CSV has 48 unique entries, with 40 NEP amounts and
  45 House amounts. It excludes the reviewed Quezon namesake. Exact sums are
  ₱993,665,000 for the NEP and ₱1,353,020,000 for the House version, compared rather
  than added.
- The historical view loads 359 program families. The 2026 filter selects 49,
  persists through a hard reload, and combines with department filters.
- Filtered CSV downloads preserve exact integer pesos and blank missing amounts.
- Project deep links survive a hard reload. The Ospital ng Tagaytay detail shows
  ₱20,000,000 in the House versions, with links to PDF page 884 and a correction
  email containing the project reference and page URL.
- Empty search and project-error states show recovery actions. Project retry
  reloads the project request rather than only refreshing the overview.
- At 390 px, all three navigation tabs are visible and the page has no horizontal
  overflow. The desktop and mobile layouts were inspected in the browser.
- The live browser recorded no warning or error logs during the final smoke check.
- HTTPS requests returned 200 for the homepage, historical view, methodology,
  project deep link, terrain asset, attribution and license. Production HTML
  matches the local build. The main apex and www website also return 200.

## Coverage limits

These figures cover national budget titles naming Tagaytay, including connecting
road corridors whose funded sections can be outside the city. They are not the
city government's budget, a complete inventory within the boundary, or evidence
of money released, spent or projects completed. The proposal source snapshot was
built on 26 October 2026; data remains dependent on BetterGov's API availability
and updates. Fifty-six explicit exclusions are published with reasons.

See [the reference review](transparency-portal-reference-review.md) and
[application maintenance notes](../apps/transparency/README.md).

## Presentation update, 23:02 PHT

Deployment job `2` succeeded at 23:02:14 PHT. Artifact SHA-256:
`b3807959c0e7fdc8bf2b408153fde14b064d2db9d71a8713c6b652b2e256bba6`.
The 1,132,242-byte artifact includes the main site's existing icon and credited
landscape WebP assets. Live HTML matches this build, with SHA-256
`7eec80c98112f4c01000a23bb3748a243fb6142815e13e49706fd385f5df8840`.

- Shortened the home tab title to “Tagaytay Transparency” and replaced the full
  wordmark favicon with the civic site's icon-only asset.
- Added the licensed Taal Lake photograph and a separate Cavite 8th District
  context card, including the API's sourced 20th Congress representative portrait.
  The office's full ledger is not added to the portal totals or historical view.
- Added consistent inset chevrons to native selects, preserving labels, keyboard
  operation and a native appearance fallback in forced-colors mode.
- Padded table rows, contained the missing-change label, and extended the hover
  background across each row. Navigation hover and active backgrounds fill each tab.
- Replaced the long default footer with the independent operator, source date and
  a small navigation row. Verbatim API notices, source, MIT and terrain credits
  remain in an expandable section. Homepage comparison notices also expand on demand.
- Improved metric cards and removed empty, disabled comparison tiles.

Strict build and ESLint checks pass. A fresh live API check still finds 48 proposal
entries and 359 historical families and reconciles 28 department/year totals. Local
desktop and 390 px mobile layouts were inspected with no horizontal overflow.
Production filters and historical navigation work, both new images load, the new
favicon returns image/png, and the landscape returns image/webp. The live browser
reported no console warnings or errors during the final smoke check.

The portrait source is the [House photograph archived on Wikimedia Commons](<https://commons.wikimedia.org/wiki/File:Rep._Aniela_Bianca_Tolentino_(20th_Congress).jpg>),
credited to the House of Representatives and listed as public domain. The linked
House profile returned 403 to the research tool; the portal retains the API's source
link and labels the context as 20th Congress rather than claiming a fresh roster audit.

## Making sense and About cleanup, 23:17 PHT

Deployment job `3` succeeded at 23:17:30 PHT. Artifact SHA-256:
`f15fe374fe0f3bf50a3c0f89b6fd356637dfe2ecc6bc8acc8f4a55b60eb0c6a8`.
The 1,135,243-byte artifact's production HTML matches the local build, with SHA-256
`8be13256506a811224fff6829265ce4742a54e50ba0316b4130bf4b1848e4b0f`.

The new [Making sense section](https://transparency.bettertagaytay.org/#making-sense)
explains NEP, House bill, GAA, missing/one-version entries and amount abbreviations.
It includes English explanations, short Filipino takeaways and clickable category
bars. A category opens its House entries in the detailed table with shareable URL
filters, and CSV exports include the derived `project_type`.

The chart groups 45 House entries totaling ₱1,353,020,000. Its categories reconcile:

| Reading category                | House entries | House amount |
| ------------------------------- | ------------: | -----------: |
| Roads and bridges               |            34 | ₱953,020,000 |
| Buildings and facilities        |             3 | ₱200,000,000 |
| Water supply                    |             5 | ₱135,000,000 |
| Health facilities and equipment |             2 |  ₱40,000,000 |
| Flood control and drainage      |             1 |  ₱25,000,000 |

These are title/program-derived groups, not official sector codes. Each record
appears in one group. NEP-only records are excluded from this House chart; uncertain
matches remain labelled, including two building/facility entries. The percentages
use the displayed House total, not the largest category as the chart's full scale.

The About page's developer setup tutorial was replaced with a short source/MIT
credit and a Back to projects button. Its excessive bottom gap was reduced. Category
methodology is published on the same page; full source notices remain available.

Validation: strict build, root/app lint and four new unit tests pass. A mutation
check confirmed that incorrectly including NEP-only rows fails the reconciliation
test. The road category opens 34 entries whose exported CSV sums to exactly
₱953,020,000. The live category filter survives a hard reload; the number glossary
expands, the old setup tutorial is absent, and Back to projects works. The local
390 px layout has no horizontal overflow, section navigation works when reselected,
and the final live browser check recorded no console warnings or errors.

## English-only update, 23:28 PHT

Following the user's revised language preference, the portal remains English-only.
The two Filipino takeaways and bilingual abbreviation examples now use plain
English. Category metadata no longer contains unused Filipino copy, and the About
methodology describes the plain-language summary without referring to a translation.

Deployment job `4` succeeded at 23:28:25 PHT. The 1,135,026-byte artifact has SHA-256
`a1730a16e1af73c39f5a1cc06b2378d291b6975b446c1f5f65105da14f7f925c`.
Production HTML matches the build, with SHA-256
`e25cda36ba9d5043226058abe690adb610dddc2cb338a161f8be0fe0ce04eeb2`.
Build, app lint and four calculation tests pass. The live page declares English,
shows both English summaries, has no Filipino-language blocks and has no
horizontal overflow during the final browser check.

## Navigation cleanup, 23:36 PHT

Removed the Making sense navigation tab and restored the three-column mobile
navigation. The explanation section and its existing anchor remain on the homepage.
The home tab remains active for homepage anchors. Build and lint pass; production
shows exactly the three remaining navigation links and the explanation section.

Deployment job `5` succeeded at 23:36:25 PHT. Artifact SHA-256:
`cf373533ba1546743b23b3b765eb1343166f3318e39acc50129df371473a2848`.
Production HTML matches the 1,135,000-byte build artifact.

## Official city finances, 23:56 PHT

Added [City finances](https://transparency.bettertagaytay.org/city-finances) as a
separate section, using the [City Government of Tagaytay’s Full Disclosure
listing](https://www.tagaytay.gov.ph/transparencyseal.html). Its 2026 index contains
34 PDF links checked successfully: four annual documents and ten reports each for
Q1, Q2 and Q3. Q4 placeholders are omitted. Listing year does not imply the period
covered by an annual document.

Two scanned returns were visually checked, with OCR used only as a reading aid:

| Source and cited page                 | Checked figure                       |            Amount |
| ------------------------------------- | ------------------------------------ | ----------------: |
| Q3 2026 receipts/expenditures, page 2 | Operating income, General Fund + SEF | ₱1,920,744,615.53 |
| Same return                           | Current operating expenditure        |   ₱511,328,069.38 |
| Same return                           | Capital/investment expenditure       |    ₱75,116,415.50 |
| Q3 2026 20% Development Fund, page 1  | 20 listed project costs              |   ₱166,184,000.00 |
| Same return                           | Separate balance row                 |         ₱1,038.00 |
| Same return                           | Printed total including balance      |   ₱166,185,038.00 |

Income sources and all operating-function categories reconcile to their printed
totals. Percentages are calculated from the amounts; minor differences from printed
percentages are disclosed. The receipts PDF repeats the same return twice. Page 2
is used once, and the target/appropriation column is not treated as reported income.
The form is labelled Q3 2026 without start/end dates, so the page preserves that
label and does not present the totals as quarter-only or add other quarters.

The development-fund return reports a cost incurred for one row, ₱56,184,000.00.
The other 19 incurred-cost cells are blank. Start dates, target completion dates
and completion percentages are blank. They remain unknown, never zero, and no
overall utilization or completion rate is inferred. Readable project labels are
shortened; an ambiguous location abbreviation is retained rather than expanded.

The checked PDF copies are versioned with the app. SHA-256 fingerprints:

- Receipts: `fa85e59b496a62c3e756d677f0e2d6df74136c9d4da84c734e89974b06092f92`.
- Development fund: `fa48cc4a48ab0f3a2afb4dd9458e1f7502c8aa81bf8f3538180ba2ea00e35c94`.

The document library supports combined search, return and type filters with URL
persistence and an empty-state reset. Other PDFs are link-checked, not summarized.
The section uses city source credits, while national pages retain BetterGov credits.
National and city figures are never added together. The existing Making sense
section remains on the homepage without a navigation tab.

Deployment job `7` succeeded at 23:56:26 PHT. Artifact: 2,835,120 bytes, SHA-256
`8cb3efb03251ebdbccacd601ecbe0ea15518b06e31302e7475dacb20e19c8b77`.
Published HTML matches the build, SHA-256
`6d27eeaff90082abfe5579742032155e91235b1fee206edf4d6c9222cfce7ada`.
Both live archived PDFs return `application/pdf` and match the checked hashes.

The live PDF check caught an existing SPA rule that rewrote PDFs to HTML. Terraform
now excludes `.pdf` from the SPA rewrite. The reviewed plan updated one existing
app setting, with zero resources added or destroyed. Branch/domain destinations
remain the same; only the transparency artifact was uploaded.

Validation: strict build, root/app lint and nine tests pass. Mutation checks caught
both treating missing incurred costs as reported and rewriting PDFs to HTML. The
390 px layout has no page overflow; project tables become readable cards. The live
Q3 filter returns ten documents, a cash-flow search returns one, and that selection
survives reload. Final browser logs contain no warnings or errors.

## Historical city returns and missing-value clarity, 9 November 2026

Expanded the City finances page to 26 checked returns across ten report years.
Year and report-period selectors use the dates printed inside the PDFs and persist
in the URL. The financial transcriptions are in `src/data/city-finances.json`, with
23 archived source PDFs, exact centavos, source pages, scope and reporting notes.

| Report year | Reviewed periods                 |
| ----------- | -------------------------------- |
| 2016        | Q1, Q2, Q3, Q4                   |
| 2017        | Q1 and annual                    |
| 2018        | Annual                           |
| 2019        | Q1 receipts statement and annual |
| 2021        | Annual                           |
| 2022        | Annual                           |
| 2023–2025   | Q1, Q2, Q3, Q4 for each year     |
| 2026        | Q1, Q2, Q3                       |

The 2016-directory PDF includes Q1 2017 on pages 5–6. The 2020-directory statement
covers CY 2019, the 2022-directory statement covers CY 2021, and the annual
statement in the 2023 directory covers CY 2022. The selectors preserve those actual
report dates. Missing periods are not treated as zero or filled by guessing from
folder names or a prior-year column.

Older total-receipts and total-expenditure layouts keep their original measures.
They are not relabelled as operating income or operating expenditure. The annual
2017 separate continuing-appropriation row is explained without silently adding it
to the printed expenditure total. Q1 2019 has no expenditure statement in the
linked PDF. Q1 2023 capital cells contain dashes and its outer/inner period labels
conflict; both limitations are visible. No cross-return sum or change is computed.

Every displayed income and expenditure breakdown reconciles to its selected total.
The faint 2025 Q4 figures were checked using the original embedded bitmap. A
full-size visual check corrected an OCR reading of the 2018 expenditure total to
₱1,361,495,191.67 before publication. OCR output itself was not published as verified
data. The 23 source PDF fingerprints and page counts were verified locally.

Replaced “Not reported” with “Not stated in report”. An explanation above the
project table states that a missing numeric amount does not mean ₱0 was spent or
that work has not started. Nineteen Q3 2026 incurred-cost cells remain null. Detailed
development-project transcription still covers Q3 2026; other selected periods
explicitly distinguish untranscribed project records from blank source fields.

The library now has 170 working PDFs from the full 2023–2026 listings and older
financial statements. One additional published 2025 Q4 SIPB link returns HTTP 404
and is listed separately as unavailable. It is not used in any summary. Listing
year, listed quarter, type and search filters combine and retain the selected
summary. Lists load 24 documents at a time, with a Show more action and empty-state
recovery.

Deployment job `8` succeeded at 00:22:12 PHT on 9 November 2026. Artifact:
29,428,395 bytes, SHA-256
`d332b2b17570568f91430b13aa9394e1f65446be9673ffbe03f7ea8e30c6a0ac`.
Published HTML matches the build, SHA-256
`9a304e4e17a1adf9e340f7a6173cb77fe7ee5614e64ae09e45f81d15ac367f48`.
All 23 live archived PDFs return `application/pdf` and match their checked hashes.

Validation: strict build, root/app lint and ten tests pass. Mutation checks caught
substituting listing years for reporting years and changing unknown amounts to
zero. Browser checks covered historical annual and quarterly formats, receipt-only
and dash-valued fields, source-page links, Back navigation, reload persistence,
combined document filters, empty-state reset and pagination. Layout checks at 390 px
and 1280 px found no page overflow. The live page renders the checked 2025 Q4 and Q2
figures and the corrected 2018 annual total. Nineteen live project cells show the new
wording; the old wording is absent. Final browser logs contain no warnings or errors.

## Development Fund history

Removed the plain-English heading above the income and expenditure charts. City
finances now has separate Income and expenditure and Development Fund views, with
year and period selection in the URL. The 26 existing financial statement
summaries remain available. The Development Fund view loads its history on demand.

Checked 50 available Development Fund reports from Q1 2014 through Q3 2026 against
the city PDFs. Q3 2021 is selectable but marked unavailable because the published
link returns 404. The report listed under Q4 2020 is labelled as calendar year
2020, with both totals linked to page 2. The library has 205 working PDFs and
lists the two unavailable links separately.

The summaries preserve the difference between printed totals, calculated sums,
appropriations, costs incurred and completion figures. The Q4 2016 appropriation
is separate from the four project entries. The Q4 2024 continuing appropriation
is separate from the lot's incurred cost. The overlapping Q1 2026 programme and
lot figures are shown separately. Blank and dash amounts remain unknown. The
existing Q3 2026 project table is retained in the Development Fund view.

Amplify job `9` succeeded at 10:56:32 PHT on 9 November 2026. Artifact:
62,066,357 bytes, SHA-256
`4c8dffac6a4ba4c085a14401931b87128262eae467063b603f2ab4ad684c1aea`.
Live HTML and build assets matched, and all 72 archived PDF copies returned
`application/pdf` with the checked source hashes.

Validation: production build, root and app lint, and all 13 tests passed. The
regression test rejected adding the Q1 2026 lot to its overlapping programme
amount. Browser checks covered the report switch, older years, the annual 2020
return, the unavailable 2021 period, missing amounts, mobile layout, and the
20-row Q3 2026 project table. The live page showed both income charts without
the removed heading and the checked Q4 2025 Development Fund figures.
