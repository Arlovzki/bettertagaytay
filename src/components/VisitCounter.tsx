import { useEffect, useState } from 'react';
import { Eye } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { loadVisitCount } from '../lib/visitCounter';

export default function VisitCounter() {
  const { t, i18n } = useTranslation('common');
  const [count, setCount] = useState<number | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;
    loadVisitCount().then(
      visits => {
        if (active) setCount(visits);
      },
      () => {
        if (active) setError(true);
      }
    );
    return () => {
      active = false;
    };
  }, []);

  return (
    <span
      className="inline-flex items-center gap-2 text-sm text-gray-300"
      role="status"
    >
      <Eye className="h-4 w-4 shrink-0" aria-hidden="true" />
      {error ? (
        t('visits.unavailable')
      ) : count === null ? (
        t('visits.loading')
      ) : (
        <>
          {t('visits.label')}{' '}
          <strong className="font-semibold tabular-nums text-gray-100">
            {new Intl.NumberFormat(i18n.language).format(count)}
          </strong>
        </>
      )}
    </span>
  );
}
