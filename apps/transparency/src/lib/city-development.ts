import data from '../data/city-development.json';

export const CITY_DEVELOPMENT = data;
export type DevelopmentReview = (typeof data.periods)[number];
export type DevelopmentPeriod =
  | DevelopmentReview
  | (typeof data.unavailablePeriods)[number];

export const DEVELOPMENT_PERIODS: DevelopmentPeriod[] = [
  ...data.periods,
  ...data.unavailablePeriods,
].sort(
  (a, b) => b.year - a.year || quarterOrder(b.quarter) - quarterOrder(a.quarter)
);

function quarterOrder(quarter: string) {
  return quarter === 'annual' ? 5 : Number(quarter.slice(1));
}

export function developmentPeriod(
  id: string | null,
  year?: number
): DevelopmentPeriod {
  const period =
    DEVELOPMENT_PERIODS.find(item => item.id === id) ??
    DEVELOPMENT_PERIODS.find(item => item.year === year) ??
    data.periods.find(item => item.id === data.defaultPeriod);
  if (!period)
    throw new Error('The default Development Fund report is missing');
  return period;
}
