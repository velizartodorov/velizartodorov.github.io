import {useTranslation} from 'react-i18next';
import {Period} from "../common/period";
import {currentDate} from "../common/utils";

export function useDisplayPeriod() {
    const {t} = useTranslation();

    function formatMonthYear(date: Date): string {
        const months = t('common:months', {returnObjects: true}) as string[];
        return `${months[date.getMonth()]} ${date.getFullYear()}`;
    }

    function display(period: Period): string {
        const today = currentDate();
        const periodLang = t('common:period', {returnObjects: true}) as Record<string, string>;
        const presentText = periodLang.present;
        const formattedStartDate = formatMonthYear(period.start);

        if (shouldShowPresent(period, today)) {
            return `${formattedStartDate} - ${presentText}`;
        }

        const formattedEndDate = formatMonthYear(period.end!);
        const isCurrentMonth = formattedEndDate === formatMonthYear(today);

        return isCurrentMonth
            ? `${formattedStartDate} - ${presentText}`
            : `${formattedStartDate} - ${formattedEndDate}`;

        function shouldShowPresent(period: Period, today: Date): boolean {
            return !period.end || period.start > today;
        }
    }

    return {display};
}
