# Tagaytay visual identity

Status: deployed to [BetterTagaytay](https://bettertagaytay.org/) on 6 November 2026. See the [production release record](production-release-2026-11-06.md).

BetterTagaytay is a community guide that helps residents find reliable city services, documents, and contacts while expressing Tagaytay's ridge landscape and everyday life.

## What the peer homepages show

These are visual observations from the live homepages, not an endorsement of their factual content or a complete accessibility audit.

| Reference                                    | Visible identity                                                                                                       | Useful lesson for Tagaytay                                                                                        |
| -------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| [BetterBaguio](https://betterbaguio.org/)    | Forest green and pale sage, oversized editorial headings, a distinctive lion and sun mark, coordinated emergency strip | Repeat one visual language across the whole interface. Local character can coexist with clear service navigation. |
| [BetterNaic](https://betternaic.vercel.app/) | Navy and yellow, an attributed aerial photograph, prominent search, direct task links and large text control           | Use authentic local photography and a straightforward route to common tasks.                                      |
| [BetterLB](https://betterlb.org/)            | Vivid blue, a compact local mark, prominent access to financial reports, infrastructure, legislation and statistics    | Give public records meaningful prominence alongside services.                                                     |
| [BetterBacolod](https://betterbacolod.org/)  | Blue split hero, search panel and colourful service icons                                                              | Familiar navigation is useful; local identity needs more than a name and logo change.                             |
| [BetterIndang](https://betterindang.org/)    | Blue patterned split hero, local crest and separate emergency and utility strips                                       | Local content gives the site context, but multiple header strips compete for attention.                           |

## Design direction

Use a calm, landscape-led identity built around the Tagaytay ridge, lake views and mist. Keep the current logo and the existing Manrope headings with DM Sans body text. The distinction should come from colour, photography, composition and consistent details.

Shared tokens in `src/index.css` also map the Kapwa primitives to this palette:

| Role            | Colour    | Use                                                                    |
| --------------- | --------- | ---------------------------------------------------------------------- |
| Lake blue       | `#214B64` | The single brand accent for primary actions, links and selected states |
| Mist            | `#F2F5F6` | Page and section backgrounds                                           |
| Cloud           | `#FCFDFD` | Reading and form surfaces                                              |
| Slate           | `#24333C` | Primary text                                                           |
| Secondary slate | `#536773` | Secondary text on cloud surfaces                                       |

Keep neutral colours cool throughout. Preserve semantic colours for real errors, warnings and success. Retain colours inside the established logo without repeating them as extra UI accents.

The homepage uses a credited 2023 photograph by Patrickroque01, taken from Maharlika West in Tagaytay, under CC BY-SA 4.0. Responsive WebP versions are about 14 KB, 47 KB and 95 KB at 480, 960 and 1440 pixels wide. The visible caption links to the source and license and identifies resizing/cropping. See [image attribution](../public/images/ATTRIBUTION.md). A prominent three-layer ridge silhouette recurs in the homepage divider and footer. It has 112 px of height on phones, 144 px on tablets and 176 px on desktop, with distinct opaque lake-blue tones. The hero background uses actual terrain contours for the Tagaytay area; the navigation bar has a plain surface.

## Page application

1. **Homepage:** Compact logo and navigation; one concise utility row; a functional headline such as "Find services in Tagaytay"; visible search and the six existing task links; a single landscape image with text on a solid surface. Residents should reach search and tasks immediately on mobile.
2. **Service guides:** Carry over lake blue headings, links, checkboxes and focus treatment. Keep office details, requirements, steps, official forms and correction links easy to scan and print.
3. **Document library:** Keep the existing native filters and corrected chevrons. Apply the same surface, border, type and focus tokens. Titles, periods, publishers and source dates should carry the hierarchy.
4. **Directories and system states:** Use the same navigation, controls and spacing vocabulary for office listings, search results, empty states, loading and errors. Do not give each section a separate design.

Keep tourism as a distinct section below essential services and records. Add local photography of everyday places as rights and provenance are established. Any weather, traffic or safety advisory must name its source and time; these are content capabilities, not decorative branding.

## Delivered scope

- Compact header with language controls, weather, USD/PHP exchange rate, Philippine date/time and an expandable emergency contact list. All four utility details remain visible on phones in two rows. The community-run notice is in the footer. The navigation surface has no contour texture.
- Search and six common task links lead the homepage. Six service categories follow, with access to the complete services listing. Public records and office shortcuts come before the separate tourism section.
- Existing logo, Manrope headings and DM Sans body typography retained. Decorative category rainbows and gradients were replaced with the shared accent and neutral surfaces.
- Service guides and document filters share the palette, form controls and focus treatment. Native select chevrons retain a 12 px inset and vertical centering.
- Guide prose now uses a semantic article rather than a card header that exposed the entire article as one heading. Existing checklists, official forms, printing and correction email links are preserved.
- The footer repeats the ridge motif, includes the shared visit total and retains community/resource links. The header remains sticky, fully visible and interactive at the footer. While the ridge passes behind it, the header background changes to a light wash with a transparent lower edge, allowing the actual artwork to continue behind the navigation. Once the header is over footer text, its surface becomes solid again to prevent text showing through. The content area stays light enough to keep controls readable; no header content is hidden or made inert. Inverse surfaces have a lighter visible focus outline.

The UI/UX skill's government query supported readable text, strong contrast, visible focus and restrained motion. Its generic single-CTA landing layout and new font suggestion were not adopted because this existing civic portal serves multiple common tasks and already has an established font pair.

## Verification

Browser checks covered homepage, guide and library layouts at representative widths of 320, 375, 768, 1024, 1280 and 1440 pixels, with no page-level horizontal overflow observed. English and Filipino interfaces were checked; guide bodies retain the previously documented English fallback where translations are missing.

Verified service search by keyboard, a homepage records shortcut, combined document filters, empty results, guide checkboxes, correction draft recipient and page context, emergency disclosure dismissal and focus return, and mutual exclusion between navigation and emergency panels. The corrected three select chevrons remain centered with 12 px right clearance.

Key computed text pairs were checked: lake blue on cloud 9.14:1; secondary slate on cloud 5.80:1; gray-500 on cloud 4.72:1; slate on mist 11.88:1; footer secondary text on its dark surface 9.97:1. This is a scoped check, not a complete accessibility certification.

Print CSS was reviewed, but an actual print/PDF export and a full assistive-technology audit were not performed for this visual refresh. Existing legal, historical and tourism content limitations remain documented in [the website audit](website-audit.md). The new landscape credit covers only the new WebP files, not the existing tourism gallery.

No counter backend, storage or infrastructure changes were made for this visual refresh.

## Elevation background

The hero uses a single north-up, proportionally scaled map of the Tagaytay area, generated from public Mapzen / AWS Terrain Tiles. Source headers identify USGS SRTM and GMTED2010 files. The asset contains 259 land contour segments at 25 m intervals, with heavier 100 m lines. It is cropped responsively, not repeated or stretched. The navigation bar remains plain.

See the [terrain generation notes](../scripts/terrain/README.md) for coordinates, source checksums, extraction checks and limitations. The footer carries the data credit and interval. The vector source is a static asset, so visitors do not make requests to an elevation API. The ridge silhouettes are illustrative brand artwork; the contour background is data-derived.

A subtle 12 px source link above the homepage title identifies the Tagaytay elevation contours, 25 m interval and USGS / Mapzen source. The reference supports English and Filipino and links to the terrain dataset. Its text uses the existing secondary slate token to retain readable contrast.

Footer blending was checked with the header fixed at viewport top, including service and emergency dropdowns. The darkest underlying footer colour combined with the light wash gives at least 4.68:1 contrast for the small navigation text; the final transparent strip is confined to the navigation’s bottom padding.
