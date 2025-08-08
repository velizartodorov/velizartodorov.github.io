import { useTranslation } from 'react-i18next';
import { Employment } from "./employment";
import { resolveDate } from '../common/utils';

export function useEmployments(): Employment[] {
  const { t } = useTranslation(['employments', 'dates']);
  const dataRaw = t('employments:list', { returnObjects: true });
  const data = Array.isArray(dataRaw) ? dataRaw : [];
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
    description: Array.isArray(e.description)
      ? e.description
      : typeof e.description === 'string'
        ? e.description.split('\n')
        : [],
    references: Array.isArray(e.references) ? e.references : [],
  }));
}