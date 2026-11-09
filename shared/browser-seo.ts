import { seoTags, type PageSeo } from './seo';

/** Replace the build-time tags when client navigation changes the page. */
export function setPageSeo(page: PageSeo) {
  const template = document.createElement('template');
  template.innerHTML = seoTags(page);
  document.head
    .querySelectorAll('[data-page-seo]')
    .forEach(tag => tag.remove());
  document.head.append(template.content);
}
