import { defineConfig, loadEnv, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import portal from './portal.config.ts';
import { DEFAULT_API, shortNameOf } from './src/config.ts';

const escape = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

/** The portal's name and description in the HTML itself, for link previews and search engines. */
function portalHtml(api: string): Plugin {
  const title = `${shortNameOf(portal)} Transparency`;
  const description = `National budget proposals and historical appropriations naming ${shortNameOf(portal)}, alongside official city financial disclosures and plain-English summaries. Every figure links to its source. Independent and community-run.`;
  const url = portal.siteUrl
    ? `<link rel="canonical" href="${escape(portal.siteUrl)}" />\n    <meta property="og:url" content="${escape(portal.siteUrl)}" />`
    : '';
  return {
    name: 'portal-html',
    transformIndexHtml: html =>
      html
        .replaceAll('%PORTAL_TITLE%', escape(title))
        .replaceAll('%PORTAL_NAME%', escape(portal.name))
        .replaceAll('%PORTAL_DESCRIPTION%', escape(description))
        .replaceAll('%PORTAL_API%', escape(api))
        .replaceAll('%PORTAL_URL_META%', url),
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
