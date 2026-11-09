export interface PageSeo {
  title: string;
  description: string;
  siteName: string;
  canonical?: string;
  image?: { url: string; alt: string };
  noIndex?: boolean;
  locale?: string;
  keywords?: string;
  twitterHandle?: string;
  type?: string;
}

export function escapeMarkup(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

export function seoTags(page: PageSeo): string {
  const meta = (
    attribute: 'name' | 'property',
    name: string,
    content: string
  ) =>
    `<meta data-page-seo ${attribute}="${name}" content="${escapeMarkup(content)}" />`;
  const tags = [
    `<title data-page-seo>${escapeMarkup(page.title)}</title>`,
    meta('name', 'description', page.description),
    meta('property', 'og:type', page.type || 'website'),
    meta('property', 'og:site_name', page.siteName),
    meta('property', 'og:title', page.title),
    meta('property', 'og:description', page.description),
    meta('property', 'og:locale', page.locale || 'en_PH'),
    meta(
      'name',
      'twitter:card',
      page.image ? 'summary_large_image' : 'summary'
    ),
    meta('name', 'twitter:title', page.title),
    meta('name', 'twitter:description', page.description),
  ];
  if (page.noIndex) tags.push(meta('name', 'robots', 'noindex, follow'));
  if (page.keywords) tags.push(meta('name', 'keywords', page.keywords));
  if (page.twitterHandle)
    tags.push(meta('name', 'twitter:site', page.twitterHandle));
  if (page.canonical && !page.noIndex) {
    tags.push(
      `<link data-page-seo rel="canonical" href="${escapeMarkup(page.canonical)}" />`,
      meta('property', 'og:url', page.canonical)
    );
  }
  if (page.image) {
    tags.push(
      meta('property', 'og:image', page.image.url),
      meta('property', 'og:image:alt', page.image.alt),
      meta('name', 'twitter:image', page.image.url),
      meta('name', 'twitter:image:alt', page.image.alt)
    );
  }
  return tags.join('\n    ');
}
