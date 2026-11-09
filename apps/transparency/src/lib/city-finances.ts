import finances from '../data/city-finances.json';
import index from '../data/city-documents.json';

export const CITY_FINANCES = finances;
export type CityReview = (typeof finances.periods)[number];
export function cityReview(period: string | null): CityReview {
  const review =
    finances.periods.find(item => item.id === period) ??
    finances.periods.find(item => item.id === finances.defaultPeriod);
  if (!review) throw new Error('The default reviewed city return is missing');
  return review;
}
export function citySource(id: string) {
  const source = finances.sources.find(item => item.id === id);
  if (!source) throw new Error(`Missing reviewed city source: ${id}`);
  return source;
}
export const CITY_DOCUMENTS = index;
export type CityDocument = (typeof index.documents)[number];
export type DocumentFilters = {
  query: string;
  quarter: string;
  type: string;
  year?: string;
};

export function centavos(value: number | null): string {
  if (value === null) return 'Not stated in report';
  if (!Number.isSafeInteger(value))
    throw new Error('City finance amounts must be integer centavos');
  return (
    '₱' +
    (value / 100).toLocaleString('en-PH', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  );
}

export function percent(value: number, total: number): number {
  return total > 0 ? (value / total) * 100 : 0;
}

export function filterCityDocuments(
  documents: CityDocument[],
  filters: DocumentFilters
): CityDocument[] {
  const words = filters.query.toLowerCase().trim().split(/\s+/).filter(Boolean);
  return documents
    .filter(
      document =>
        (!filters.year || String(document.listingYear) === filters.year) &&
        (!filters.quarter || document.quarter === filters.quarter) &&
        (!filters.type || document.title === filters.type) &&
        words.every(word =>
          `${document.title} ${document.quarter} ${document.listingYear}`
            .toLowerCase()
            .includes(word)
        )
    )
    .sort(
      (a, b) =>
        b.listingYear - a.listingYear ||
        b.quarter.localeCompare(a.quarter) ||
        a.title.localeCompare(b.title)
    );
}

/** Blank incurred-cost cells remain unknown; they are never included as zero. */
export function developmentCoverage(
  projects: { costCentavos: number; incurredCentavos: number | null }[]
) {
  const reported = projects.filter(
    project => project.incurredCentavos !== null
  );
  return {
    listedCost: projects.reduce(
      (sum, project) => sum + project.costCentavos,
      0
    ),
    reportedRows: reported.length,
    reportedIncurred: reported.reduce(
      (sum, project) =>
        project.incurredCentavos === null
          ? sum
          : sum + project.incurredCentavos,
      0
    ),
    missingRows: projects.length - reported.length,
  };
}
