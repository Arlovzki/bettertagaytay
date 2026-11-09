# Tagaytay transparency portal reference review

Reviewed on 8 November 2026. This is a review of visible landing pages, navigation,
coverage descriptions and discoverable features, not a full functional audit of
every peer portal. Public headline totals are deliberately not reproduced here.

| Reference                                                              | Finding used for Tagaytay                                                                                                                                                                |
| ---------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Antipolo](https://antipolo-transparency-portal.vercel.app/)           | Distinct city presentation with proposal and historical views. Keep Tagaytay's identity, but describe proposal amounts without suggesting they were spent.                               |
| [Los Baños](https://budget.betterlb.org/)                              | A focused proposal comparison. Retain the additional historical view in Tagaytay.                                                                                                        |
| [Ilocos Norte](https://budget.betterilocosnorte.org/)                  | Standard BetterGov office/district context and source access. Shared office totals need clear geographic limits.                                                                         |
| [Bukidnon](https://budget.betterbukidnon.org/)                         | Standard comparison groups and searchable entries. Preserve the API's candidate labels.                                                                                                  |
| [Aklan](https://transparency.betteraklan.org/)                         | Standard proposal, historical and methodology navigation. Use the same clear separation of proposal versions and enacted years.                                                          |
| [Zamboanga Peninsula](https://portal.zampen-budget-ph.workers.dev/)    | The supplied address did not resolve during review. No feature conclusions drawn.                                                                                                        |
| [Morong](https://budget.bettermorong.org/)                             | Link back to the main civic website. Tagaytay links to its civic site and local financial document library.                                                                              |
| [Leganes](https://leganes-budget-transparency-portal.onrender.com/)    | Standard searchable project list and source-backed comparison. Keep filters shareable through the URL.                                                                                   |
| [Negros Oriental](https://negor-transparency-portal.vercel.app/)       | Standard budget views and source/methodology access. Publish the source snapshot date.                                                                                                   |
| [Zambales](https://zambales-portal.vercel.app/)                        | Standard office and district context. Avoid presenting a wider office's entire budget as a city allocation.                                                                              |
| [Lapu-Lapu](https://www.betterlapulapu.org/government/budget-projects) | Budget projects sit within the civic website, with multilingual navigation and provisional-data context. Connect Tagaytay's separate subdomain back to the main site's document library. |

## Tagaytay decisions

Use the [BetterGov open-source foundation](https://github.com/bettergovph/transparency-portal)
for its data model, comparison status, filters, source pages, CSV exports, pagination
and scope checks. Keep BetterTagaytay's lake blue, two-font system, logo and subtle
real elevation contours. A budget portal benefits from dense readable figures and
direct navigation rather than the civic homepage's large photographic hero.

The main hierarchy is 2027 proposals, budgets 2020–2026 and about the data. The scope
notice appears before totals. The footer identifies the independent operator,
source snapshot, data provider and terrain attribution. Project correction links
open email to the operator.

## Scope audit

The public [Budget API](https://budget.bettergov.ph/docs) locates DPWH entries by
office and searches titles by name. A road named after Tagaytay can have a funded
section in another municipality. This portal therefore says “entries naming
Tagaytay”, not “all projects inside Tagaytay” or “the city's budget”.

One 2027 entry describes Sitio Tagaytay, San Andres, Quezon and is excluded. The
historical search also returns unrelated places named Tagaytay and pooled national
allocations. Fifty-five historical exclusions are explicit and visible on `/about`.
The historical search has no region filter, so this review cannot rely on IV-A alone.

An unusual historical namesake, bridge B04268LZ on the Comun-Inarado-Peñafrancia road,
is identified under Albay 2nd DEO in the [official DPWH Region V budget document](https://www.dpwh.gov.ph/DPWH/sites/default/files/gaa_2022_region_05.pdf).
That bridge is excluded rather than attributed to Tagaytay City.

Connecting corridor entries are retained with the coverage caveat. No entire Cavite,
Laguna or Batangas DEO ledger is imported. The public exclusions record the reviewed
scope; it remains a title-based selection rather than a surveyed project boundary.
