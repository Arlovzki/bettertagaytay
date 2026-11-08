export const documentTypes = [
  'form',
  'checklist',
  'budget',
  'financial-report',
  'procurement',
  'reference',
] as const;
export type DocumentType = (typeof documentTypes)[number];

export interface PublicDocument {
  id: string;
  title: string;
  type: string;
  year: number | null;
  quarter: number | null;
  url: string;
  publisher: string;
  sourceUrl: string;
  checkedAt: string;
  keywords: string[];
}

export interface DocumentFilters {
  query: string;
  type: string;
  year: string;
  quarter: string;
  invalid: boolean;
}

export function readDocumentFilters(
  params: URLSearchParams,
  years: number[]
): DocumentFilters {
  const type = params.get('type') ?? '';
  const year = params.get('year') ?? '';
  const quarter = params.get('quarter') ?? '';
  const validType = !type || documentTypes.some(value => value === type);
  const validYear = !year || years.some(value => String(value) === year);
  const validQuarter = !quarter || ['1', '2', '3', '4'].includes(quarter);
  return {
    query: (params.get('q') ?? '').slice(0, 160),
    type: validType ? type : '',
    year: validYear ? year : '',
    quarter: validQuarter ? quarter : '',
    invalid: !validType || !validYear || !validQuarter,
  };
}

export function filterDocuments(
  documents: PublicDocument[],
  filters: DocumentFilters
) {
  const terms = filters.query
    .trim()
    .toLocaleLowerCase()
    .split(/\s+/)
    .filter(Boolean);
  return documents
    .filter(document => {
      if (filters.type && document.type !== filters.type) return false;
      if (filters.year && String(document.year) !== filters.year) return false;
      if (filters.quarter && String(document.quarter) !== filters.quarter)
        return false;
      const text =
        `${document.title} ${document.publisher} ${document.year ?? ''} ${document.keywords.join(' ')}`.toLocaleLowerCase();
      return terms.every(term => text.includes(term));
    })
    .sort(
      (first, second) =>
        (second.year ?? 0) - (first.year ?? 0) ||
        (second.quarter ?? 0) - (first.quarter ?? 0) ||
        first.title.localeCompare(second.title)
    );
}
