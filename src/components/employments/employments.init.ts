import { useTranslation } from 'react-i18next';
import { Employment } from "./employment";
import { resolveDate } from '../common/utils';

export function useEmployments(): Employment[] {
  const { t, i18n } = useTranslation(['employments', 'dates', 'common']);
  
  console.debug('useEmployments hook called');
  
  // Check if i18n is initialized
  if (!i18n.isInitialized) {
    console.debug('i18n not yet initialized, returning empty array');
    return [];
  }
  
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
  console.debug('Employment data type:', typeof employmentData);
  console.debug('Employment data is array:', Array.isArray(employmentData));
  
  if (!Array.isArray(employmentData)) {
    console.error('Employment data is not an array:', employmentData);
    return [];
  }
  
  if (employmentData.length === 0) {
    console.warn('Employment data array is empty');
    return [];
  }
  
  console.debug('Processing employment data with length:', employmentData.length);
  
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
      console.debug(`Raw start date: ${startDateStr}`);
      startDateStr = resolveDate(startDateStr, i18n);
      console.debug(`Resolved start date: ${e.period.start} -> ${startDateStr}`);
    } else {
      console.warn(`No start date found for employment ${index + 1}`);
    }
    
    // Resolve end date
    let endDateStr = e.period?.end;
    if (endDateStr) {
      console.debug(`Raw end date: ${endDateStr}`);
      endDateStr = resolveDate(endDateStr, i18n);
      console.debug(`Resolved end date: ${e.period.end} -> ${endDateStr}`);
    } else {
      console.warn(`No end date found for employment ${index + 1}`);
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
  
  console.debug('Processed employments:', processedEmployments);
  console.debug('Final employments count:', processedEmployments.length);
  
  return processedEmployments;
}