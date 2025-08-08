import { useTranslation } from 'react-i18next';
import { Employment } from "./employment";
import { resolveDate } from '../common/utils';

export function useEmployments(): Employment[] {
  const { t } = useTranslation(['employments', 'dates']);
  const data = t('employments:list', { returnObjects: true }) as any[];
  return data.map((e: any) => ({
    position: e.position,
    company: e.company,
    type: e.type ?? '',
    place: e.place,
    icon: e.icon,
    period:
      e.period && typeof e.period.start === 'string' && typeof e.period.end === 'string'
        ? {
            start: new Date(resolveDate(e.period.start)),
            end: new Date(resolveDate(e.period.end)),
          }
        : { start: new Date(), end: new Date() },
    description: e.description,
    references: Array.isArray(e.references) ? e.references : [],
  }));
}