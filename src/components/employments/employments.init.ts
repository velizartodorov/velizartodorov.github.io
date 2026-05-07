import { useTranslation } from 'react-i18next';
import { Employment, Position } from "./employment";
import { resolveDate, currentDate } from '../common/utils';

export function useEmployments(): Employment[] {
  const { t } = useTranslation(['employments', 'dates']);
  const employmentData = t('employments:list', { returnObjects: true });

  const data = Array.isArray(employmentData) ? employmentData : [];

  return data.map((c: Employment): Employment => ({
    company: c.company,
    icon: c.icon,
    type: c.type ?? '',
    positions: Array.isArray(c.positions) ? c.positions.map(toPosition) : [],
  }));
}

function toPosition(p: Position): Position {
  return {
    position: p.position,
    place: p.place,
    period: resolvePeriod(p),
    description: p.description,
    references: Array.isArray(p.references) ? p.references : [],
  };
}

function parseDate(value: unknown): Date | undefined {
  if (typeof value !== 'string') return undefined;
  const resolved = resolveDate(value);
  if (!resolved) return undefined;
  const date = new Date(resolved);
  date.setUTCHours(0, 0, 0, 0);
  return date;
}

function resolvePeriod(p: Position): { start: Date; end?: Date; } {
  const start = parseDate(p.period?.start) ?? currentDate();
  const end = parseDate(p.period?.end) ?? currentDate();
  return { start, end };
}
