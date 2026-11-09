import { useEffect, useMemo, useState } from 'react';
import { createVisitCounter } from '../../../../shared/visit-counter';

const formatCount = new Intl.NumberFormat('en-PH');

export function VisitCounter({ endpoint }: { endpoint: string }) {
  const loadCount = useMemo(
    () =>
      createVisitCounter({
        getEndpoint: () => endpoint,
        readOnly: import.meta.env.DEV,
        sessionKey: 'bt_transparency_visit_session',
      }),
    [endpoint]
  );
  const [visits, setVisits] = useState<number | 'unavailable' | null>(null);

  useEffect(() => {
    let active = true;
    loadCount().then(
      count => {
        if (active) setVisits(count);
      },
      () => {
        if (active) setVisits('unavailable');
      }
    );
    return () => {
      active = false;
    };
  }, [loadCount]);

  return (
    <p className="footer-visits" role="status" aria-atomic="true">
      Website visits:{' '}
      {typeof visits === 'number' ? (
        <strong>{formatCount.format(visits)}</strong>
      ) : (
        (visits ?? 'loading…')
      )}
    </p>
  );
}
