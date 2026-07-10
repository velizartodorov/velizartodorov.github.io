import { useEmploymentStats } from '../employments/employment_stats';

export function useFormatBody(bodyRaw: unknown) {
    const { totalTime, totalYears } = useEmploymentStats();
    return Array.isArray(bodyRaw)
        ? interpolate(bodyRaw.join(' '), { totalTime, totalYears })
        : interpolate(String(bodyRaw), { totalTime, totalYears });
}

function interpolate(template: string, vars: Record<string, string | number>) {
    return template.replaceAll(/\{(\w+)}/g, (_, key) => (vars[key] === undefined ? `{${key}}` : String(vars[key])));
}
