import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowUpRight, FileText, Search } from 'lucide-react';
import records from '../data/documents.json';
import {
  documentTypes,
  filterDocuments,
  readDocumentFilters,
} from '../lib/publicDocuments';
import Section from '../components/ui/Section';
import Breadcrumbs from '../components/ui/Breadcrumbs';
import SEO from '../components/SEO';
import { formatSourceDate } from '../lib/serviceGuide';
import Select from '../components/ui/Select';

const years = [
  ...new Set(
    records.flatMap(record => (record.year === null ? [] : [record.year]))
  ),
].sort((a, b) => b - a);

export default function PublicDocuments() {
  const { t, i18n } = useTranslation('common');
  const [params, setParams] = useSearchParams();
  const filters = readDocumentFilters(params, years);
  const results = filterDocuments(records, filters);
  const [pagination, setPagination] = useState({ key: '', limit: 12 });
  const limit = pagination.key === params.toString() ? pagination.limit : 12;
  const visible = results.slice(0, limit);
  const hasFilters = Boolean(params.toString());

  const updateFilter = (key: string, value: string) => {
    // Consecutive changes must retain filters set before React rerenders.
    const next = new URLSearchParams(window.location.search);
    if (value) next.set(key, value);
    else next.delete(key);
    setParams(next, { replace: key === 'q' });
  };
  const fieldClass =
    'w-full min-h-11 rounded-lg border border-gray-500 bg-white px-3 py-2 text-base text-gray-900';
  const labelClass = 'block mb-2 text-sm font-semibold text-gray-800';

  return (
    <>
      <SEO title={t('records.title')} description={t('records.description')} />
      <Section>
        <Breadcrumbs
          className="mb-6"
          items={[
            { label: t('nav.home'), href: '/' },
            { label: t('records.title') },
          ]}
        />
        <div className="max-w-3xl mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-3">
            {t('records.title')}
          </h1>
          <p className="text-base text-gray-700">{t('records.description')}</p>
        </div>

        <form
          role="search"
          aria-label={t('records.title')}
          onSubmit={event => event.preventDefault()}
          className="rounded-xl border border-gray-300 bg-gray-50 p-4 sm:p-6 mb-7"
        >
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="sm:col-span-2 lg:col-span-1">
              <label htmlFor="record-query" className={labelClass}>
                {t('records.search')}
              </label>
              <div className="relative">
                <Search
                  aria-hidden="true"
                  className="absolute h-4 w-4 left-3 top-1/2 -translate-y-1/2 text-gray-700"
                />
                <input
                  id="record-query"
                  type="search"
                  maxLength={160}
                  value={filters.query}
                  onChange={event => updateFilter('q', event.target.value)}
                  placeholder={t('records.placeholder')}
                  className={`${fieldClass} pl-9`}
                />
              </div>
            </div>
            <div>
              <label htmlFor="record-type" className={labelClass}>
                {t('records.type')}
              </label>
              <Select
                id="record-type"
                value={filters.type}
                onChange={event => updateFilter('type', event.target.value)}
              >
                <option value="">{t('records.allTypes')}</option>
                {documentTypes.map(type => (
                  <option key={type} value={type}>
                    {t(`records.types.${type}`)}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <label htmlFor="record-year" className={labelClass}>
                {t('records.year')}
              </label>
              <Select
                id="record-year"
                value={filters.year}
                onChange={event => updateFilter('year', event.target.value)}
              >
                <option value="">{t('records.allYears')}</option>
                {years.map(year => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <label htmlFor="record-quarter" className={labelClass}>
                {t('records.quarter')}
              </label>
              <Select
                id="record-quarter"
                value={filters.quarter}
                onChange={event => updateFilter('quarter', event.target.value)}
              >
                <option value="">{t('records.allQuarters')}</option>
                {[1, 2, 3, 4].map(quarter => (
                  <option key={quarter} value={quarter}>
                    {t('records.quarterNumber', { quarter })}
                  </option>
                ))}
              </Select>
            </div>
          </div>
          {filters.invalid && (
            <p role="alert" className="mt-4 text-sm text-error-700">
              {t('records.invalidFilters')}
            </p>
          )}
        </form>

        <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
          <p role="status" className="text-sm font-semibold text-gray-800">
            {t('records.results', { count: results.length })}
          </p>
          {hasFilters && (
            <button
              type="button"
              onClick={() => setParams({})}
              className="inline-flex min-h-11 items-center font-semibold text-sm text-primary-700 underline underline-offset-4"
            >
              {t('records.clear')}
            </button>
          )}
        </div>
        {results.length ? (
          <>
            <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {visible.map(record => (
                <li key={record.id} className="min-w-0">
                  <article className="h-full flex flex-col rounded-xl border border-gray-300 bg-white p-5">
                    <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-primary-700 mb-3">
                      <FileText
                        aria-hidden="true"
                        className="h-4 w-4 shrink-0"
                      />
                      <span>{t(`records.types.${record.type}`)}</span>
                      {record.year !== null && (
                        <span className="rounded-md bg-primary-50 px-2 py-1">
                          {record.year}
                          {record.quarter ? ` · Q${record.quarter}` : ''}
                        </span>
                      )}
                    </div>
                    <h2 className="text-lg font-bold text-gray-900 leading-snug mb-3">
                      {record.title}
                    </h2>
                    <p className="text-sm text-gray-700 mb-1">
                      {record.publisher}
                    </p>
                    <p className="text-xs text-gray-700 mb-5">
                      {t('records.checked', {
                        date: formatSourceDate(record.checkedAt, i18n.language),
                      })}
                    </p>
                    <div className="mt-auto flex flex-wrap items-center justify-between gap-3 border-t border-gray-200 pt-3">
                      <a
                        href={record.url}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={t('records.openNamed', {
                          title: record.title,
                        })}
                        className="inline-flex min-h-11 items-center gap-2 font-semibold text-sm text-primary-700 hover:underline"
                      >
                        {t('records.open')}
                        <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
                      </a>
                      <a
                        href={record.sourceUrl}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={t('records.sourceNamed', {
                          title: record.title,
                        })}
                        className="inline-flex min-h-11 items-center text-sm text-gray-700 underline underline-offset-4"
                      >
                        {t('records.source')}
                      </a>
                    </div>
                  </article>
                </li>
              ))}
            </ul>
            {visible.length < results.length && (
              <div className="mt-7 text-center">
                <button
                  type="button"
                  onClick={() =>
                    setPagination({ key: params.toString(), limit: limit + 12 })
                  }
                  className="inline-flex items-center justify-center min-h-11 rounded-lg bg-primary-700 hover:bg-primary-800 px-5 py-2 font-semibold text-sm text-white"
                >
                  {t('records.more')}
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="rounded-xl border border-gray-300 bg-gray-50 p-6">
            <h2 className="font-bold text-lg text-gray-900 mb-2">
              {t('records.emptyTitle')}
            </h2>
            <p className="text-gray-700">{t('records.emptyDescription')}</p>
          </div>
        )}
        <p className="mt-8 text-sm text-gray-700">{t('records.periodNote')}</p>
      </Section>
    </>
  );
}
