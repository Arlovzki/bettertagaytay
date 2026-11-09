import type { PageSeo } from '../../shared/seo';

export const MAIN_SITE_URL = 'https://bettertagaytay.org';
export const MAIN_SITE_NAME = 'BetterTagaytay.org';
export const MAIN_SHARE_IMAGE = '/images/bettertagaytay-share.png';

export const MAIN_PAGES: Record<
  string,
  { title: string; description: string }
> = {
  '/': {
    title: 'Tagaytay City Services and Public Documents',
    description:
      'Find Tagaytay City services, permit requirements, official forms, public documents, and local information on BetterTagaytay, an independent community website.',
  },
  '/services': {
    title: 'Tagaytay City Services',
    description:
      'Find requirements, forms, and office contacts for permits, scholarships, health services, and other Tagaytay City services.',
  },
  '/government': {
    title: 'Tagaytay City Government Directory',
    description:
      'Browse Tagaytay City departments, officials, local ordinances, guides, and public reports.',
  },
  '/documents': {
    title: 'Tagaytay Public Documents and Forms',
    description:
      'Browse official Tagaytay City forms, checklists, budgets, and financial reports, with links to the original documents.',
  },
  '/services/tourism/sports-and-exercise': {
    title: 'Public Sports and Exercise Facilities in Tagaytay',
    description:
      'Find public places to walk, run, and play sports in Tagaytay, with locations and access information.',
  },
  '/services/tourism/explore-tourist-spots': {
    title: 'Places to Visit in Tagaytay',
    description:
      'Explore Tagaytay attractions, viewpoints, parks, and places to visit around the city.',
  },
};

export function mainPageSeo(
  path: string,
  title: string,
  description: string,
  siteUrl = MAIN_SITE_URL,
  image = MAIN_SHARE_IMAGE,
  siteName = MAIN_SITE_NAME
): PageSeo {
  return {
    title: `${title} | ${siteName}`,
    description,
    siteName,
    canonical: new URL(
      path === '/government/departments/legislative'
        ? '/government/legislative'
        : path,
      siteUrl
    ).href,
    image: {
      url: new URL(image, siteUrl).href,
      alt: 'BetterTagaytay, a community guide to Tagaytay City',
    },
  };
}
