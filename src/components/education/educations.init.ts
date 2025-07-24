
import { IEducation } from "./education.init";
import { useTranslation } from 'react-i18next';
import { parsePeriod } from "./utils";

export function useEducations(): IEducation[] {
    const { t } = useTranslation();
    const list = t('education:list', { returnObjects: true }) as any[];
    return Array.isArray(list)
        ? list.map((e: any) => ({
            ...e,
            period: e.period ? parsePeriod(e.period) : { start: new Date(0), end: new Date(0) },
        }))
        : [];
}