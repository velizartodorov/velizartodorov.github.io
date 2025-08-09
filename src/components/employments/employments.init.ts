import { useTranslation } from 'react-i18next';
import { Employment } from "./employment";
import { resolveDate } from '../common/utils';

export function useEmployments(): Employment[] {
  const { t, i18n } = useTranslation(['employments', 'dates', 'common']);

  // Check if i18n is initialized
  if (!i18n.isInitialized) {
    console.debug('i18n not yet initialized, returning empty array');
    return [];
  }

  const bundle = i18n.getResourceBundle(i18n.language, 'employments');

  const employmentData = bundle?.list || [];

  if (!Array.isArray(employmentData)) {
    return [];
  }

  if (employmentData.length === 0) {
    return [];
  }

  const processedEmployments = employmentData.map((e: any, index: number) => {
    console.debug(`Processing employment ${index + 1}/${employmentData.length}:`, {
      position: e.position,
      company: e.company,
      period: e.period,
      periodType: typeof e.period,
      startType: typeof e.period?.start,
      endType: typeof e.period?.end
    });

    // Resolve start date
    let startDateStr = e.period?.start;
    if (startDateStr) {
      startDateStr = resolveDate(startDateStr, i18n);
    } else {
    }

    // Resolve end date
    let endDateStr = e.period?.end;
    if (endDateStr) {
      endDateStr = resolveDate(endDateStr, i18n);
    } else {
    }

    return {
      position: e.position,
      company: e.company,
      type: e.type ?? '',
      place: e.place,
      icon: e.icon,
      period:
        e.period && typeof e.period.start === 'string' && typeof e.period.end === 'string' && startDateStr && endDateStr
          ? {
            start: new Date(startDateStr),
            end: new Date(endDateStr),
          }
          : { start: new Date(), end: new Date() },
      description: Array.isArray(e.description)
        ? e.description
        : typeof e.description === 'string'
          ? e.description.split('\n')
          : [],
      references: Array.isArray(e.references) ? e.references : [],
    };
  });
  return processedEmployments;
}