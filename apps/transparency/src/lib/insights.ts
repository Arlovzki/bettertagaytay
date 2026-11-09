import type { ProjectRow } from '../api/types';

export const PROJECT_TYPES = [
  { id: 'roads', label: 'Roads & bridges' },
  { id: 'buildings', label: 'Buildings & facilities' },
  { id: 'water', label: 'Water supply' },
  { id: 'drainage', label: 'Flood control & drainage' },
  { id: 'health', label: 'Health facilities & equipment' },
  { id: 'education', label: 'Schools & classrooms' },
  { id: 'irrigation', label: 'Farm irrigation' },
  { id: 'other', label: 'Other projects' },
] as const;

export type ProjectType = (typeof PROJECT_TYPES)[number]['id'];
type NamedProject = Pick<ProjectRow, 'dataset' | 'title'>;
export type InsightProject = NamedProject &
  Pick<ProjectRow, 'house_php' | 'held'>;

/** A reader aid, not an official sector code. Ordered rules put each entry in one group. */
export function projectType(project: NamedProject): ProjectType {
  if (project.dataset === 'hfep') return 'health';
  if (project.dataset === 'nia') return 'irrigation';
  if (project.dataset === 'fmr') return 'roads';
  const title = project.title.toLowerCase();
  if (/\bflood|\bdrainage\b|\briver control\b/.test(title)) return 'drainage';
  if (/\bwater\b|\bwaterworks\b/.test(title)) return 'water';
  if (
    /\b(road|rd|bridge|highway|expressway|intersection|flyover)\b/.test(title)
  )
    return 'roads';
  if (/\b(hospital|ospital|health|clinic|medical|datrc)\b/.test(title))
    return 'health';
  if (/\b(school|classroom|university|college)\b/.test(title))
    return 'education';
  if (
    /\b(building|facility|facilities|tower)\b|multi[\s-]*purpose|covered court|sports complex/.test(
      title
    )
  )
    return 'buildings';
  return 'other';
}

export function houseBreakdown(projects: readonly InsightProject[]) {
  const rows = projects.filter(project => project.house_php != null);
  const total = rows.reduce(
    (sum, project) => sum + (project.house_php ?? 0),
    0
  );
  const categories = PROJECT_TYPES.map(type => {
    const entries = rows.filter(project => projectType(project) === type.id);
    const amount = entries.reduce(
      (sum, project) => sum + (project.house_php ?? 0),
      0
    );
    return {
      ...type,
      entries: entries.length,
      amount,
      share: total > 0 ? amount / total : 0,
      uncertain: entries.filter(project => project.held).length,
    };
  })
    .filter(type => type.entries > 0)
    .sort((a, b) => b.amount - a.amount || a.label.localeCompare(b.label));
  return { total, entries: rows.length, categories };
}
