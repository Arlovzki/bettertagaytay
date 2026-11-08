import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowUpRight, MapPin } from 'lucide-react';
import facilities from '../data/sportsFacilities.json';
import siteContact from '../data/siteContact.json';
import { buildCorrectionEmail } from '../lib/corrections';
import { formatSourceDate } from '../lib/serviceGuide';
import Section from '../components/ui/Section';
import Select from '../components/ui/Select';
import Breadcrumbs from '../components/ui/Breadcrumbs';
import SEO from '../components/SEO';

const activities = [...new Set(facilities.flatMap(place => place.activities))];
const pageUrl =
  'https://bettertagaytay.org/services/tourism/sports-and-exercise';

export default function SportsAndExercise() {
  const { t, i18n } = useTranslation('common');
  const language = i18n.resolvedLanguage === 'fil' ? 'fil' : 'en';
  const [params, setParams] = useSearchParams();
  const query = params.get('q') ?? '';
  const activity = params.get('activity') ?? '';
  const terms = query.toLocaleLowerCase().trim().split(/\s+/).filter(Boolean);
  const results = facilities.filter(place => {
    const text = [
      place.name,
      ...Object.values(place.location),
      ...Object.values(place.description),
      ...place.activities.map(key => `${key} ${t(`sports.activities.${key}`)}`),
    ]
      .join(' ')
      .toLocaleLowerCase();
    return (
      (!activity || place.activities.includes(activity)) &&
      terms.every(term => text.includes(term))
    );
  });
  const update = (key: string, value: string) => {
    const next = new URLSearchParams(window.location.search);
    if (value) next.set(key, value);
    else next.delete(key);
    setParams(next, { replace: key === 'q' });
  };
  return (
    <>
      <SEO title={t('sports.title')} description={t('sports.description')} />
      <Section>
        <Breadcrumbs
          className="mb-6"
          items={[
            { label: t('nav.home'), href: '/' },
            { label: t('nav.services'), href: '/services' },
            { label: t('sports.title') },
          ]}
        />
        <div className="max-w-3xl mb-7">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-3">
            {t('sports.title')}
          </h1>
          <p className="text-base text-gray-700">{t('sports.description')}</p>
          <p className="text-sm text-gray-600 mt-3">{t('sports.notice')}</p>
        </div>
        <form
          role="search"
          aria-label={t('sports.title')}
          onSubmit={event => event.preventDefault()}
          className="grid sm:grid-cols-[2fr_1fr] gap-4 rounded-xl border border-gray-300 bg-gray-50 p-4 sm:p-6 mb-6"
        >
          <div>
            <label
              htmlFor="sports-query"
              className="block mb-2 text-sm font-semibold text-gray-800"
            >
              {t('sports.search')}
            </label>
            <input
              id="sports-query"
              type="search"
              maxLength={160}
              value={query}
              onChange={event => update('q', event.target.value)}
              className="w-full min-h-11 rounded-lg border border-gray-500 bg-white px-3 py-2 text-base text-gray-900"
            />
          </div>
          <div>
            <label
              htmlFor="sports-activity"
              className="block mb-2 text-sm font-semibold text-gray-800"
            >
              {t('sports.activity')}
            </label>
            <Select
              id="sports-activity"
              value={activity}
              onChange={event => update('activity', event.target.value)}
            >
              <option value="">{t('sports.all')}</option>
              {activities.map(key => (
                <option value={key} key={key}>
                  {t(`sports.activities.${key}`)}
                </option>
              ))}
              {activity && !activities.includes(activity) && (
                <option value={activity}>{activity}</option>
              )}
            </Select>
          </div>
        </form>
        <div className="flex items-center justify-between gap-4 mb-5">
          <p role="status" className="text-sm text-gray-700">
            {t('sports.count', { count: results.length })}
          </p>
          {(query || activity) && (
            <button
              type="button"
              onClick={() => setParams({})}
              className="min-h-11 text-sm font-semibold text-primary-700 underline underline-offset-4"
            >
              {t('sports.clear')}
            </button>
          )}
        </div>
        {results.length === 0 && (
          <h2 className="text-xl font-bold text-gray-900 py-8">
            {t('sports.empty')}
          </h2>
        )}
        <div className="grid lg:grid-cols-2 gap-5">
          {results.map(place => (
            <article
              key={place.id}
              id={place.id}
              className="rounded-xl border border-gray-300 bg-white p-5 sm:p-6 min-w-0 scroll-mt-44"
            >
              <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs font-semibold text-primary-700 mb-3">
                {place.activities.map(key => (
                  <span key={key}>{t(`sports.activities.${key}`)}</span>
                ))}
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                {place.name}
              </h2>
              <p className="flex gap-2 text-sm text-gray-600 mb-3">
                <MapPin
                  aria-hidden="true"
                  className="w-4 h-4 shrink-0 mt-0.5"
                />
                {place.location[language]}
              </p>
              <p className="text-base text-gray-700 leading-relaxed">
                {place.description[language]}
              </p>
              <div className="border-l-2 border-primary-300 pl-3 mt-5">
                <h3 className="text-sm font-bold text-gray-900 mb-1">
                  {t('sports.access')}
                </h3>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {place.access[language]}
                </p>
              </div>
              {place.mapUrl && (
                <a
                  href={place.mapUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 min-h-11 text-sm font-semibold text-primary-700 underline underline-offset-4 mt-3"
                >
                  {t('sports.directions')}
                  <ArrowUpRight aria-hidden="true" className="w-4 h-4" />
                </a>
              )}
              <details className="mt-4 border-t border-gray-200 pt-2 text-sm text-gray-600">
                <summary className="cursor-pointer py-3 font-medium text-gray-700">
                  {t('sports.sources')}
                </summary>
                <p className="mb-2">
                  {t('sports.checked', {
                    date: formatSourceDate(place.checkedAt, language),
                  })}
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  {place.sources.map(source => (
                    <li key={source.url}>
                      <a
                        href={source.url}
                        target="_blank"
                        rel="noreferrer"
                        className="underline underline-offset-2 hover:text-primary-700"
                      >
                        {source.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </details>
              <a
                href={buildCorrectionEmail(
                  import.meta.env.VITE_CORRECTION_EMAIL ||
                    siteContact.correctionEmail,
                  place.name,
                  `${pageUrl}#${place.id}`
                )}
                className="inline-flex items-center min-h-11 text-xs text-gray-600 underline underline-offset-4 hover:text-primary-700 mt-2"
              >
                {t('sports.report')}
                <span className="sr-only">: {place.name}</span>
              </a>
            </article>
          ))}
        </div>
        <p className="text-sm text-gray-700 mt-8 max-w-3xl">
          {t('sports.enquiry')}{' '}
          <a
            href="tel:0468889500"
            className="text-primary-700 underline underline-offset-2"
          >
            (046) 888-9500
          </a>
        </p>
      </Section>
    </>
  );
}
