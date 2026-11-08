import Section from '../ui/Section';
import { getCategoryIcon } from '../../lib/categoryIcons';
import { Heading } from '../ui/Heading';
import { Text } from '../ui/Text';
import { useTranslation } from '../../hooks/useTranslation';
import { Link } from 'react-router-dom';
import { useInView } from '../../hooks/useInView';

import { governmentCategories } from '../../data/yamlLoader';

interface Category {
  category: string;
  slug: string;
  description: string;
  icon: string;
}

interface GovernmentActivitySectionProps {
  title?: string;
  description?: string;
}

export default function GovernmentActivitySection({
  title,
  description,
}: GovernmentActivitySectionProps = {}) {
  const { t } = useTranslation();
  const { ref, inView } = useInView<HTMLDivElement>();

  const getIcon = (iconName: string) => {
    const IconComponent = getCategoryIcon(iconName);
    return IconComponent ? <IconComponent className="h-5 w-5" /> : null;
  };

  const displayedCategories = governmentCategories.categories as Category[];

  return (
    <Section id="government">
      <Heading level={2}>{title || t('governmentActivity.title')}</Heading>
      <Text className="text-gray-600 mb-6">
        {description || t('governmentActivity.description')}
      </Text>

      <div
        ref={ref}
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
      >
        {displayedCategories.map((category, idx) => {
          return (
            <Link
              key={category.slug}
              to={`/government/${category.slug}`}
              className="group block rounded-xl border border-gray-300 bg-white hover:bg-primary-50 hover:border-primary-500 transition-colors p-5"
              style={{
                opacity: inView ? 1 : 0,
                transform: inView ? 'translateY(0)' : 'translateY(24px)',
                transition: `opacity 0.5s ease ${idx * 60}ms, transform 0.5s ease ${idx * 60}ms, box-shadow 0.2s, translate 0.2s`,
              }}
            >
              <div className="bg-primary-50 text-primary-700 w-10 h-10 rounded-lg flex items-center justify-center mb-3">
                {getIcon(category.icon)}
              </div>
              <h3 className="text-base font-bold mb-2 text-gray-900 group-hover:text-primary-700">
                {t(
                  `governmentActivity.categories.${category.slug}.name`,
                  category.category
                )}
              </h3>
              <p className="text-sm leading-relaxed text-gray-600">
                {t(
                  `governmentActivity.categories.${category.slug}.description`,
                  category.description
                )}
              </p>
            </Link>
          );
        })}
      </div>
    </Section>
  );
}
