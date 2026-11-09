import { resolve } from 'node:path';
import { defineConfig, loadEnv, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import portal from './portal.config.ts';
import { DEFAULT_API } from './src/config.ts';
import { PORTAL_PAGE_PATHS, portalPageSeo } from './src/lib/page-seo.ts';
import { SEO_MARKER, writeSeoPages } from '../../scripts/static-seo.ts';
import { escapeMarkup, seoTags } from '../../shared/seo.ts';

/** The portal's name and description in the HTML itself, for link previews and search engines. */
function portalHtml(api: string): Plugin {
  let build: boolean;
  let outDir: string;
  return {
    name: 'portal-html',
    configResolved(config) {
      build = config.command === 'build';
      outDir = resolve(config.root, config.build.outDir);
    },
    transformIndexHtml(html, context) {
      const template = html.replaceAll('%PORTAL_API%', escapeMarkup(api));
      if (build) return template;
      const path = new URL(context.originalUrl || '/', 'http://localhost')
        .pathname;
      return template.replace(SEO_MARKER, () =>
        seoTags(portalPageSeo(portal, path))
      );
    },
    writeBundle() {
      const pages = PORTAL_PAGE_PATHS.map(path => ({
        path,
        seo: portalPageSeo(portal, path),
      }));
      // Old district links still open the homepage's offices section.
      writeSeoPages(
        outDir,
        portal.siteUrl,
        [
          ...pages,
          {
            path: '/districts',
            seo: portalPageSeo(portal, '/'),
            inSitemap: false,
          },
        ],
        {
          '404.html': {
            title: `Page not found | ${portal.name}`,
            description: 'Browse national budgets and city finances.',
            siteName: portal.name,
            noIndex: true,
          },
          'project-shell.html': {
            ...portalPageSeo(portal, '/projects'),
            canonical: undefined,
          },
        }
      );
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_');
  const api = (env.VITE_API_BASE || portal.api || DEFAULT_API).replace(
    /\/+$/,
    ''
  );
  return {
    plugins: [react(), portalHtml(api)],
    server: {
      host: '0.0.0.0',
      // Reserved in ~/projects/ports.md (transparency-portal). strictPort so a
      // collision fails loudly instead of moving the URL.
      port: 5132,
      strictPort: true,
      allowedHosts: ['dev.neonplayground.com'],
    },
    preview: { host: '0.0.0.0', port: 5132, strictPort: true },
  };
});
