import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Section from './ui/Section';
import {
  loadServiceIndex,
  searchServices,
  type ServiceSearchResult,
} from '../lib/serviceSearch';

export default function ServiceSearch() {
  const { t } = useTranslation('common');
  const [params, setParams] = useSearchParams();
  const query = params.get('q')?.trim() ?? '';
  const [services, setServices] = useState<ServiceSearchResult[] | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;
    loadServiceIndex().then(
      data => {
        if (active) setServices(data);
      },
      () => {
        if (active) setError(true);
      }
    );
    return () => {
      active = false;
    };
  }, []);

  const results = searchServices(services ?? [], query);

  return (
    <Section className={query ? undefined : 'pb-0'}>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        {t('search.title')}
      </h1>
      <form
        role="search"
        className="flex flex-wrap items-end gap-3 max-w-2xl"
        onSubmit={event => {
          event.preventDefault();
          const value = String(
            new FormData(event.currentTarget).get('q') ?? ''
          ).trim();
          setParams(value ? { q: value } : {});
        }}
      >
        <div className="flex-1 min-w-40">
          <label htmlFor="directory-search" className="sr-only">
            {t('hero.findService')}
          </label>
          <input
            key={query}
            id="directory-search"
            name="q"
            type="search"
            defaultValue={query}
            placeholder={t('hero.searchPlaceholder')}
            className="w-full min-h-11 rounded-lg border border-gray-500 px-3 py-2 text-base text-gray-900 placeholder:text-gray-600"
          />
        </div>
        <button className="inline-flex items-center justify-center gap-2 min-h-11 rounded-lg bg-primary-700 hover:bg-primary-800 px-5 py-2 text-sm font-semibold text-white">
          <Search className="h-4 w-4" aria-hidden="true" />
          {t('search.submit')}
        </button>
      </form>
      {query && (
        <div
          className="mt-8"
          aria-live="polite"
          aria-busy={!services && !error}
        >
          {error ? (
            <p role="alert">{t('search.error')}</p>
          ) : !services ? (
            <p>{t('search.loading')}</p>
          ) : (
            <>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                {t('search.results', { count: results.length, query })}
              </h2>
              {results.length ? (
                <ul className="grid gap-4 md:grid-cols-2">
                  {results.map(service => (
                    <li key={`${service.categorySlug}/${service.slug}`}>
                      <Link
                        to={`/services/${service.categorySlug}/${service.slug}`}
                        className="block h-full rounded-xl border border-gray-300 bg-white p-5 hover:border-primary-500 hover:bg-primary-50 transition-colors"
                      >
                        <span className="text-xs font-semibold text-primary-700">
                          {service.categoryName}
                        </span>
                        <h3 className="font-semibold text-gray-900 mt-1">
                          {service.name}
                        </h3>
                        {service.description && (
                          <p className="mt-2 text-sm text-gray-700">
                            {service.description}
                          </p>
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-700">{t('search.empty')}</p>
              )}
              <Link
                to="/services"
                className="inline-flex min-h-11 items-center mt-5 font-semibold text-primary-700 underline underline-offset-4"
              >
                {t('services.viewAll')}
              </Link>
            </>
          )}
        </div>
      )}
    </Section>
  );
}
