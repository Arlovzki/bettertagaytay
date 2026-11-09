import { resolve } from 'node:path';
import { defineConfig, loadEnv, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { mainSeoPages } from './scripts/main-seo';
import { SEO_MARKER, writeSeoPages } from './scripts/static-seo';
import { seoTags } from './shared/seo';

function siteSeo(env: Record<string, string>): Plugin {
  let root: string;
  let outDir: string;
  let build: boolean;
  return {
    name: 'bettertagaytay-seo',
    configResolved(config) {
      root = config.root;
      outDir = resolve(root, config.build.outDir);
      build = config.command === 'build';
    },
    transformIndexHtml(html, context) {
      if (build) return html;
      const { pages } = mainSeoPages(root, env);
      const path = new URL(context.originalUrl || '/', 'http://localhost')
        .pathname;
      const page = pages.find(item => item.path === path) || pages[0];
      return html.replace(SEO_MARKER, () => seoTags(page.seo));
    },
    writeBundle() {
      const { siteUrl, pages } = mainSeoPages(root, env);
      writeSeoPages(outDir, siteUrl, pages, {
        '404.html': {
          title: 'Page not found | BetterTagaytay.org',
          description:
            'Find services and public information for Tagaytay City.',
          siteName: 'BetterTagaytay.org',
          noIndex: true,
        },
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_');
  return {
    plugins: [react(), tailwindcss(), siteSeo(env)],
    assetsInclude: ['**/*.md'],
  };
});
