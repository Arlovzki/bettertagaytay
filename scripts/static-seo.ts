import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { escapeMarkup, seoTags, type PageSeo } from '../shared/seo.ts';

export const SEO_MARKER = '<!-- page-seo -->';

export interface StaticSeoPage {
  path: string;
  seo: PageSeo;
  inSitemap?: boolean;
}

export function writeSeoPages(
  outDir: string,
  siteUrl: string | undefined,
  pages: StaticSeoPage[],
  fallbacks: Record<string, PageSeo>
) {
  const template = readFileSync(join(outDir, 'index.html'), 'utf8');
  if (!template.includes(SEO_MARKER)) {
    throw new Error('The HTML entry point is missing its page-seo marker');
  }

  const writeHtml = (file: string, seo: PageSeo) => {
    const output = join(outDir, file);
    mkdirSync(dirname(output), { recursive: true });
    writeFileSync(
      output,
      template.replace(SEO_MARKER, () => seoTags(seo))
    );
  };

  for (const { path, seo } of pages) {
    if (path === '/') {
      writeHtml('index.html', seo);
    } else {
      // Amplify serves both clean URLs and their trailing-slash form.
      writeHtml(`${path.slice(1)}.html`, seo);
      writeHtml(`${path.slice(1)}/index.html`, seo);
    }
  }
  for (const [file, seo] of Object.entries(fallbacks)) {
    writeHtml(file, seo);
  }

  if (siteUrl) {
    const urls = pages.flatMap(({ path, inSitemap, seo }) =>
      inSitemap !== false &&
      seo.canonical === new URL(path, siteUrl).href &&
      !seo.noIndex
        ? [`  <url><loc>${escapeMarkup(seo.canonical)}</loc></url>`]
        : []
    );
    writeFileSync(
      join(outDir, 'sitemap.xml'),
      `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`
    );
    writeFileSync(
      join(outDir, 'robots.txt'),
      `User-agent: *\nAllow: /\nSitemap: ${new URL('/sitemap.xml', siteUrl).href}\n`
    );
  }
}
