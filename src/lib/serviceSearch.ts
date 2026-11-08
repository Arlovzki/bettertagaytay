import { loadCategoryIndex, serviceCategories } from '../data/yamlLoader';

export interface ServiceSearchResult {
  name: string;
  slug: string;
  description?: string;
  categorySlug: string;
  categoryName: string;
}

let serviceIndex: Promise<ServiceSearchResult[]> | undefined;

export function loadServiceIndex() {
  serviceIndex ??= Promise.all(
    serviceCategories.categories.map(async category => {
      const index = await loadCategoryIndex(category.slug);
      return index.pages.map(page => ({
        ...page,
        categorySlug: category.slug,
        categoryName: category.category,
      }));
    })
  ).then(categories => categories.flat());
  return serviceIndex;
}

export function searchServices(services: ServiceSearchResult[], query: string) {
  const terms = query.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
  if (!terms.length) return [];
  return services.filter(service => {
    const text =
      `${service.name} ${service.categoryName} ${service.description ?? ''}`.toLocaleLowerCase();
    return terms.every(term => text.includes(term));
  });
}
