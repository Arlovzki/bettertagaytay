import Section from '../ui/Section';
import { getCategoryIcon } from '../../lib/categoryIcons';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { serviceCategories } from '../../data/yamlLoader';

const homeCategories = [
  'business',
  'health-services',
  'social-welfare',
  'education',
  'housing-land-use',
  'garbage-waste-disposal',
];

export default function ServicesSection({
  title,
  description,
  compact = false,
}: {
  title?: string;
  description?: string;
  compact?: boolean;
}) {
  const { t } = useTranslation('common');
  const categories = serviceCategories.categories;
  const displayed = compact
    ? homeCategories.flatMap(slug =>
        categories.filter(item => item.slug === slug)
      )
    : categories;

  return (
    <Section>
      <div className="flex flex-wrap items-end justify-between gap-4 mb-7">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900 mb-2">
            {title || t('services.title')}
          </h2>
          <p className="text-gray-600 text-base max-w-xl">
            {description || t('services.description')}
          </p>
        </div>
        {compact && (
          <Link
            to="/services"
            className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-primary-700 hover:underline underline-offset-4"
          >
            {t('services.viewAll')}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {displayed.map(category => {
          const Icon = getCategoryIcon(category.icon);
          return (
            <Link
              key={category.slug}
              to={`/services/${category.slug}`}
              className="group flex items-start gap-4 rounded-xl border border-gray-300 bg-white p-5 hover:border-primary-500 hover:bg-primary-50 transition-colors"
            >
              <div className="shrink-0 w-10 h-10 rounded-lg bg-primary-50 text-primary-700 flex items-center justify-center">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-base font-bold text-gray-900 group-hover:text-primary-700 mb-2">
                  {t(
                    `services.categories.${category.slug}.name`,
                    category.category
                  )}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {t(
                    `services.categories.${category.slug}.description`,
                    category.description
                  )}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </Section>
  );
}
