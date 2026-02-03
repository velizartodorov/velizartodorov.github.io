import { useTranslation } from 'react-i18next';
import { Employment } from "./employment";
import { resolveDate, currentDate } from '../common/utils';

export function useEmployments(): Employment[] {
  const { t } = useTranslation(['employments', 'dates']);
  const employmentData = t('employments:list', { returnObjects: true });
  
  // Ensure we have an array to work with
  const data = Array.isArray(employmentData) ? employmentData : [];
  
  return data.map((e: Employment) => ({
    position: e.position,
    company: e.company,
    type: e.type ?? '',
    place: e.place,
    icon: e.icon,
    period: resolvePeriod(e),
    description: e.description,
    references: Array.isArray(e.references) ? e.references : [],
  }));
}

function parseDate(value: unknown): Date | undefined {
  if (typeof value !== 'string') return undefined;
  const resolved = resolveDate(value);
  if (!resolved) return undefined;
  const date = new Date(resolved);
  date.setUTCHours(0, 0, 0, 0);
  return date;
}

function resolvePeriod(e: Employment): { start: Date; end?: Date; } {
  const start = parseDate(e.period?.start) ?? currentDate();
  const end = parseDate(e.period?.end) ?? currentDate();
  return { start, end };
}
