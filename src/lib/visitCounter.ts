import { createVisitCounter } from '../../shared/visit-counter';

export const loadVisitCount = createVisitCounter({
  sessionKey: 'bt_visit_session',
  readOnly: import.meta.env.DEV,
  async getEndpoint() {
    const override = import.meta.env.VITE_VISIT_COUNTER_URL;
    if (override) return override;

    const response = await fetch('/site-config.json', {
      signal: AbortSignal.timeout(8000),
    });
    if (!response.ok) throw new Error('Counter configuration unavailable');
    const config = await response.json();
    return config.visitCounterUrl;
  },
});
