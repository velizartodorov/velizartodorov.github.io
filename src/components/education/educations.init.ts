
import { useTranslation } from 'react-i18next';
import { parsePeriod } from "../common/utils";
import { IEducation } from "./education.init";

export function useEducations(): IEducation[] {
    const { t } = useTranslation();
    const list = t('education:list', { returnObjects: true }) as IEducation[];
    return Array.isArray(list)
        ? list.map((e: IEducation) => ({
            ...e,
            period: e.period ? parsePeriod(e.period) :
                {
                    start: new Date(0),
                    end: new Date(0)
                },
        }))
        : [];
}