import type { PageSeo } from '../../../../shared/seo.ts';
import { shortNameOf, type PortalConfig } from '../config.ts';

export function portalPageSeo(
  config: PortalConfig,
  path: string,
  projectTitle?: string
): PageSeo {
  const name = shortNameOf(config);
  const pages: Record<string, { title: string; description: string }> = {
    '/': {
      title: `${name} Transparency Portal`,
      description: `Compare national budget proposals naming ${name} and explore historical appropriations and city financial disclosures, with links to the source documents.`,
    },
    '/city-finances': {
      title: `${name} City Finances | Transparency Portal`,
      description: `Browse ${name} City income, expenditure, and Development Fund summaries by year and quarter, with links to the original public reports.`,
    },
    '/gaa': {
      title: `${name} Historical National Budgets | Transparency Portal`,
      description: `Find entries naming ${name} in the enacted national budgets from 2020 to 2026. Browse the figures and trace them to their sources.`,
    },
    '/about': {
      title: `About the Data | ${name} Transparency Portal`,
      description: `Learn how the ${name} Transparency Portal selects and verifies budget figures, reads city disclosure reports, and links to its sources.`,
    },
  };
  const page = pages[path] || {
    title: `${projectTitle || 'National Budget Project'} | ${name} Transparency Portal`,
    description: projectTitle
      ? `View the published budget figures and source documents for ${projectTitle}.`
      : `View national budget figures and source documents for projects naming ${name}.`,
  };
  const siteUrl = config.siteUrl;
  const image = config.shareImage || config.logo;
  return {
    ...page,
    siteName: config.name,
    canonical: siteUrl ? new URL(path, siteUrl).href : undefined,
    image:
      siteUrl && image
        ? { url: new URL(image, siteUrl).href, alt: config.name }
        : undefined,
  };
}

export const PORTAL_PAGE_PATHS = ['/', '/city-finances', '/gaa', '/about'];
