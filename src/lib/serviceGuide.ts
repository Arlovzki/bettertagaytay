export interface GuideLink {
  label: string;
  url: string;
}

export interface ServiceGuide {
  office: string;
  location: string;
  hours: string;
  fees: string;
  processingTime: string;
  contactLabel: string;
  contactUrl: string;
  checkedAt: string;
  sourceName: string;
  sourceUrl: string;
  checklist: string[];
  forms: GuideLink[];
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

export function readServiceGuide(value: unknown): ServiceGuide | null {
  if (!isRecord(value)) return null;
  const {
    office,
    location,
    hours,
    fees,
    processingTime,
    contactLabel,
    contactUrl,
    checkedAt,
    sourceName,
    sourceUrl,
    checklist,
    forms,
  } = value;
  if (
    typeof office !== 'string' ||
    typeof location !== 'string' ||
    typeof hours !== 'string' ||
    typeof fees !== 'string' ||
    typeof processingTime !== 'string' ||
    typeof contactLabel !== 'string' ||
    typeof contactUrl !== 'string' ||
    !/^(tel:|mailto:)/.test(contactUrl) ||
    typeof checkedAt !== 'string' ||
    !/^\d{4}-\d{2}-\d{2}$/.test(checkedAt) ||
    typeof sourceName !== 'string' ||
    typeof sourceUrl !== 'string' ||
    !sourceUrl.startsWith('https://') ||
    !Array.isArray(checklist) ||
    !checklist.every((item): item is string => typeof item === 'string') ||
    !Array.isArray(forms)
  )
    return null;

  const links = forms.flatMap((item: unknown) =>
    isRecord(item) &&
    typeof item.label === 'string' &&
    typeof item.url === 'string' &&
    item.url.startsWith('https://')
      ? [{ label: item.label, url: item.url }]
      : []
  );
  return {
    office,
    location,
    hours,
    fees,
    processingTime,
    contactLabel,
    contactUrl,
    checkedAt,
    sourceName,
    sourceUrl,
    checklist,
    forms: links,
  };
}

export function formatSourceDate(date: string, language: string) {
  return new Intl.DateTimeFormat(language, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${date}T00:00:00Z`));
}
