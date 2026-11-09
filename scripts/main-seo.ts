import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import yaml from 'js-yaml';
import type {
  CategoryData,
  CategoryIndexData,
} from '../src/data/categoryTypes';
import {
  MAIN_PAGES,
  MAIN_SHARE_IMAGE,
  MAIN_SITE_URL,
  mainPageSeo,
} from '../src/lib/siteSeo';
import type { StaticSeoPage } from './static-seo';

export function mainSeoPages(root: string, env: Record<string, string>) {
  const siteUrl = env.VITE_WEBSITE_URL || MAIN_SITE_URL;
  const image = env.VITE_OG_IMAGE_URL || MAIN_SHARE_IMAGE;
  const pages = new Map<string, StaticSeoPage>();
  const add = (
    path: string,
    title: string,
    description: string,
    inSitemap = true
  ) => {
    if (!pages.has(path)) {
      pages.set(path, {
        path,
        seo: mainPageSeo(path, title, description, siteUrl, image),
        inSitemap,
      });
    }
  };

  for (const [path, page] of Object.entries(MAIN_PAGES)) {
    const description =
      path === '/'
        ? env.VITE_SITE_DESCRIPTION || page.description
        : page.description;
    add(path, page.title, description);
  }

  for (const section of ['services', 'government']) {
    const { categories } = yaml.load(
      readFileSync(join(root, 'src', 'data', `${section}.yaml`), 'utf8')
    ) as CategoryData;
    for (const category of categories) {
      const path = `/${section}/${category.slug}`;
      const folder = join(root, 'content', section, category.slug);
      const indexFile = join(folder, 'index.yaml');
      const index = existsSync(indexFile)
        ? (yaml.load(readFileSync(indexFile, 'utf8')) as CategoryIndexData)
        : undefined;
      const entries = index?.pages || [];
      add(path, category.category, category.description, entries.length > 0);
      if (!existsSync(folder)) continue;

      // Markdown files can also be linked directly from navigation or other documents.
      for (const file of readdirSync(folder)) {
        if (!/^[a-z0-9-]+\.md$/.test(file)) continue;
        const slug = file.slice(0, -3);
        const content = readFileSync(join(folder, file), 'utf8').trim();
        if (!content) continue;
        const entry = entries.find(page => page.slug === slug);
        const heading = content.match(/^#\s+(.+)$/m)?.[1];
        add(
          `${path}/${slug}`,
          heading || entry?.name || slug,
          entry?.description || category.description
        );
      }

      for (const entry of entries) {
        const nestedIndex = join(
          root,
          'content',
          section,
          entry.slug,
          'index.yaml'
        );
        if (existsSync(nestedIndex)) {
          add(
            `${path}/${entry.slug}`,
            entry.name,
            entry.description || category.description,
            false
          );
        }
      }
    }
  }

  return { siteUrl, pages: [...pages.values()] };
}
