import { ArrowRight, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function TourismSection() {
  const { t } = useTranslation('common');
  return (
    <section
      className="bg-primary-900 text-white py-11 sm:py-14"
      data-tone="inverse"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col lg:flex-row lg:items-center justify-between gap-7">
        <div className="max-w-xl">
          <p className="flex items-center gap-2 text-sm text-primary-200 mb-3">
            <MapPin className="h-4 w-4" aria-hidden="true" />
            {t('homeTourism.eyebrow')}
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3">
            {t('homeTourism.title')}
          </h2>
          <p className="text-primary-100 text-base leading-relaxed">
            {t('homeTourism.description')}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-x-7 gap-y-3">
          <Link
            to="/services/tourism/sports-and-exercise"
            className="inline-flex min-h-11 items-center text-sm font-semibold text-white underline underline-offset-4 hover:text-primary-200"
          >
            {t('sports.title')}
          </Link>
          <Link
            to="/services/tourism/explore-tourist-spots"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-semibold text-primary-900 hover:bg-primary-100 transition-colors"
          >
            {t('homeTourism.places')}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
          <Link
            to="/services/tourism"
            className="inline-flex min-h-11 items-center text-sm font-semibold text-white underline underline-offset-4 hover:text-primary-200"
          >
            {t('homeTourism.services')}
          </Link>
        </div>
      </div>
    </section>
  );
}
