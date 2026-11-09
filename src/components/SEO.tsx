import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { setPageSeo } from '../../shared/browser-seo';
import { MAIN_PAGES, mainPageSeo } from '../lib/siteSeo';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  noIndex?: boolean;
}

export default function SEO({
  title,
  description,
  keywords,
  noIndex,
}: SEOProps) {
  const { pathname } = useLocation();
  const { i18n } = useTranslation('common');
  const filipino = i18n.resolvedLanguage === 'fil';

  useEffect(() => {
    const path = '/' + pathname.replace(/^\/+|\/+$/g, '');
    const page = noIndex || filipino ? undefined : MAIN_PAGES[path];
    const home = MAIN_PAGES['/'];
    const meta = mainPageSeo(
      path,
      page?.title || title || home.title,
      (path === '/' && import.meta.env.VITE_SITE_DESCRIPTION) ||
        page?.description ||
        description ||
        home.description,
      import.meta.env.VITE_WEBSITE_URL || undefined,
      import.meta.env.VITE_OG_IMAGE_URL || undefined
    );
    setPageSeo({
      ...meta,
      keywords,
      noIndex,
      locale: filipino ? 'fil_PH' : 'en_PH',
      twitterHandle: import.meta.env.VITE_TWITTER_HANDLE,
    });
  }, [pathname, title, description, keywords, noIndex, filipino]);

  return null;
}
