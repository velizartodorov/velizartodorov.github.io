import { useTranslation } from 'react-i18next';
import { Employment } from "./employment";
import { resolveDate } from '../common/utils';

export function useEmployments(): Employment[] {
  const { t, i18n } = useTranslation(['employments', 'dates']);
  
  // Debug the employment data structure
  console.debug('Employment resources:', {
    en: i18n.getResourceBundle('en', 'employments'),
    nl: i18n.getResourceBundle('nl', 'employments'),
  });

  // Access the bundle and get the list property
  const bundle = i18n.getResourceBundle(i18n.language, 'employments');
  console.debug('Employment bundle:', bundle);

  // Get the list from the bundle
  const employmentData = bundle?.list || [];
  console.debug('Raw employment data:', employmentData);
  
  if (!Array.isArray(employmentData)) {
    console.error('Employment data is not an array:', employmentData);
    return [];
  }
  
  return employmentData.map((e: any) => ({
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