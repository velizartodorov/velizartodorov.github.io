import { useTranslation } from 'react-i18next';
import { Employment, Position } from './employment';
import { resolveDate, currentDate } from '../common/utils';

type Translate = (key: string, options: { ns: string }) => unknown;

export function useEmployments(): Employment[] {
    const { t } = useTranslation(['employments', 'dates']);
    const employmentData = t('employments:list', { returnObjects: true });

    const data = Array.isArray(employmentData) ? employmentData : [];

    return data.map((c: Employment): Employment => ({
        company: c.company,
        icon: c.icon,
        type: c.type ?? '',
        positions: Array.isArray(c.positions) ? c.positions.map((p) => toPosition(p, t)) : [],
    }));
}

function toPosition(p: Position, t: Translate): Position {
    return {
        position: p.position,
        place: p.place,
        period: resolvePeriod(p, t),
        description: p.description,
        references: Array.isArray(p.references) ? p.references : [],
    };
}

function parseDate(value: unknown, t: Translate): Date | undefined {
    if (typeof value !== 'string') return undefined;
    const resolved = resolveDate(value, t);
    if (!resolved) return undefined;
    const date = new Date(resolved);
    date.setUTCHours(0, 0, 0, 0);
    return date;
}

function resolvePeriod(p: Position, t: Translate): { start: Date; end?: Date } {
    const start = parseDate(p.period?.start, t) ?? currentDate();
    const end = parseDate(p.period?.end, t) ?? currentDate();
    return { start, end };
}
