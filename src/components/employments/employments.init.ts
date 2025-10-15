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

function resolvePeriod(e: Employment): { start: Date; end: Date; } {
  if (!e.period || typeof e.period.start !== 'string') {
    return { start: currentDate(), end: currentDate() };
  }

  const startDateStr = resolveDate(e.period.start);
  if (!startDateStr) {
    return { start: currentDate(), end: currentDate() };
  }
  const startDate = new Date(startDateStr);
  startDate.setUTCHours(0, 0, 0, 0);
  
  if (!e.period.end || typeof e.period.end !== 'string') {
    const today = currentDate();
    return { start: startDate, end: today };
  }

  const endDateStr = resolveDate(e.period.end);
  const endDate = endDateStr ? new Date(endDateStr) : currentDate();
  endDate.setUTCHours(0, 0, 0, 0);
  return { start: startDate, end: endDate };
}
