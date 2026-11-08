import { ArrowRight, Building2, FileText, Landmark } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Section from '../ui/Section';

const resources = [
  {
    key: 'financial',
    href: '/documents?type=financial-report',
    icon: Landmark,
  },
  { key: 'forms', href: '/documents?type=form', icon: FileText },
  { key: 'offices', href: '/government/departments', icon: Building2 },
];

export default function RecordsSection() {
  const { t } = useTranslation('common');
  return (
    <Section className="bg-gray-50">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-7">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900 mb-2">
            {t('homeRecords.title')}
          </h2>
          <p className="text-base text-gray-600 max-w-xl">
            {t('homeRecords.description')}
          </p>
        </div>
        <Link
          to="/documents"
          className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-primary-700 hover:underline underline-offset-4"
        >
          {t('homeRecords.all')}
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
      <div className="grid md:grid-cols-3 gap-x-8 gap-y-5">
        {resources.map(({ key, href, icon: Icon }) => (
          <Link
            key={key}
            to={href}
            className="group flex items-start gap-3 border-t border-gray-300 pt-5 pb-2"
          >
            <Icon
              className="h-5 w-5 shrink-0 text-primary-700 mt-1"
              aria-hidden="true"
            />
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-bold text-gray-900 group-hover:text-primary-700 mb-2">
                {t(`homeRecords.${key}`)}
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {t(`homeRecords.${key}Description`)}
              </p>
            </div>
            <ArrowRight
              className="h-4 w-4 shrink-0 text-primary-700 mt-1"
              aria-hidden="true"
            />
          </Link>
        ))}
      </div>
    </Section>
  );
}
