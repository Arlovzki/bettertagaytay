import { useId } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowUpRight, Mail, Phone, Printer } from 'lucide-react';
import { formatSourceDate, type ServiceGuide } from '../lib/serviceGuide';
import { buildCorrectionEmail } from '../lib/corrections';
import siteContact from '../data/siteContact.json';

export default function ServiceGuideOverview({
  guide,
  title,
}: {
  guide: ServiceGuide;
  title: string;
}) {
  const { t, i18n } = useTranslation('common');
  const checklistId = useId();
  const ContactIcon = guide.contactUrl.startsWith('mailto:') ? Mail : Phone;
  const fields = [
    ['office', guide.office],
    ['location', guide.location],
    ['hours', guide.hours],
    ['fees', guide.fees],
    ['processingTime', guide.processingTime],
  ];
  const correction = buildCorrectionEmail(
    import.meta.env.VITE_CORRECTION_EMAIL || siteContact.correctionEmail,
    title,
    new URL(
      window.location.pathname,
      import.meta.env.VITE_WEBSITE_URL || 'https://bettertagaytay.org'
    ).href
  );

  return (
    <div className="mb-8">
      <div className="rounded-xl border border-gray-300 bg-gray-50 p-5 sm:p-6">
        <dl className="grid gap-x-8 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">
          {fields.map(([key, value]) => (
            <div key={key} className="min-w-0">
              <dt className="text-xs font-bold uppercase tracking-wide text-gray-700 mb-1">
                {t(`guide.${key}`)}
              </dt>
              <dd className="text-sm leading-relaxed text-gray-900">{value}</dd>
            </div>
          ))}
        </dl>
        <div className="flex flex-wrap gap-3 mt-6 print:hidden">
          <a
            href={guide.contactUrl}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-primary-700 hover:bg-primary-800 px-4 py-2 text-sm font-semibold text-white"
          >
            <ContactIcon className="h-4 w-4" aria-hidden="true" />
            {guide.contactLabel}
          </a>
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-gray-500 bg-white hover:bg-primary-50 px-4 py-2 text-sm font-semibold text-primary-700"
          >
            <Printer className="h-4 w-4" aria-hidden="true" />
            {t('guide.print')}
          </button>
        </div>
      </div>
      {guide.forms.length > 0 && (
        <div className="mt-6">
          <h2 className="text-lg font-bold text-gray-900 mb-2">
            {t('guide.forms')}
          </h2>
          <ul className="flex flex-wrap gap-x-6 gap-y-1">
            {guide.forms.map(form => (
              <li key={form.url}>
                <a
                  href={form.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center min-h-11 gap-2 text-sm font-semibold text-primary-700 underline underline-offset-4"
                >
                  {form.label}
                  <ArrowUpRight
                    className="h-4 w-4 shrink-0"
                    aria-hidden="true"
                  />
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
      <fieldset className="mt-6">
        <legend className="text-lg font-bold text-gray-900 mb-3">
          {t('guide.checklist')}
        </legend>
        <ul className="grid gap-2 sm:grid-cols-2">
          {guide.checklist.map((item, index) => (
            <li key={item} className="min-w-0">
              <label
                htmlFor={`${checklistId}-${index}`}
                className="flex min-h-11 h-full cursor-pointer items-start gap-3 rounded-lg border border-gray-300 bg-white p-3 text-sm text-gray-800"
              >
                <input
                  id={`${checklistId}-${index}`}
                  type="checkbox"
                  className="mt-0.5 h-5 w-5 shrink-0 accent-primary-700"
                />
                <span>{item}</span>
              </label>
            </li>
          ))}
        </ul>
      </fieldset>
      <div className="mt-6 flex flex-wrap justify-between items-center gap-x-6 gap-y-2 text-sm">
        <p className="text-gray-700">
          {t('guide.checked', {
            date: formatSourceDate(guide.checkedAt, i18n.language),
          })}{' '}
          ·{' '}
          <a
            href={guide.sourceUrl}
            target="_blank"
            rel="noreferrer"
            className="text-primary-700 underline underline-offset-4"
          >
            {guide.sourceName}
          </a>
        </p>
        <a
          href={correction}
          className="inline-flex min-h-11 items-center gap-2 text-primary-700 font-semibold underline underline-offset-4 print:hidden"
        >
          <Mail className="h-4 w-4 shrink-0" aria-hidden="true" />
          {t('guide.correction')}
        </a>
      </div>
    </div>
  );
}
