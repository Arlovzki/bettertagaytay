import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { setPageSeo } from '../../../../shared/browser-seo';
import { portalPageSeo } from './page-seo';
import { usePortal } from './portal-context';

/** Keep metadata in step with browser navigation and fetched project titles. */
export function usePageSeo(projectTitle?: string, notFound = false) {
  const { pathname } = useLocation();
  const { config } = usePortal();
  useEffect(() => {
    const path = '/' + pathname.replace(/^\/+|\/+$/g, '');
    const page = portalPageSeo(config, path, projectTitle);
    setPageSeo(
      notFound
        ? {
            ...page,
            title: `Page not found | ${config.name}`,
            noIndex: true,
          }
        : page
    );
  }, [config, pathname, projectTitle, notFound]);
}
