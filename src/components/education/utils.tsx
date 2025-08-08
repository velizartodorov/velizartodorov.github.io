

import { useTranslation } from 'react-i18next';
import { Period } from "../common/period";
import { currentDate } from "../common/utils";

export function useDisplayPeriod(): (period: Period) => string {
    const { t } = useTranslation();
    const getMonthYear = useMonthYear();
    return (period: Period) => {
        const formattedStartDate = getMonthYear(period.start);
        const formattedEndDate = getMonthYear(period.end);
        const present = t('common:present') || 'Present';
        const conjunction = '-';
        return formattedEndDate === getMonthYear(currentDate())
            ? `${formattedStartDate} ${conjunction} ${present}`
            : `${formattedStartDate} ${conjunction} ${formattedEndDate}`;
    };
}

export function useMonthYear(): (date: Date) => string {
    const { t } = useTranslation();
    return (date: Date) => {
        const months = t('common:months', { returnObjects: true }) as string[];
        const month = date.getMonth();
        const year = date.getFullYear();
        return `${months[month]} ${year}`;
    };
}

