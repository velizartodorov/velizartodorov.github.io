import { describe, expect, it, vi } from 'vitest';
import { currentDate, iconFit, iconInvertsOnDark, parsePeriod, resolveDate } from './utils';
import { Period } from './period';

// The real callers pass raw "{{dates:...}}" placeholder strings through fields typed as `Date`
// (resolved later via resolveDate/parsePeriod itself); mirror that here rather than fighting it.
function period(start: string, end?: string): Period {
    return { start: start as unknown as Date, end: end as unknown as Date };
}

describe('resolveDate', () => {
    it('returns an empty string for a falsy input', () => {
        expect(resolveDate('', vi.fn())).toBe('');
    });

    it('returns the raw string unchanged when it is not a dates: placeholder', () => {
        expect(resolveDate('2024-01-01', vi.fn())).toBe('2024-01-01');
    });

    it('resolves a {{dates:key}} placeholder through the translate function', () => {
        const t = vi.fn(() => '2024-03-15');
        expect(resolveDate('{{dates:collibra_start}}', t)).toBe('2024-03-15');
        expect(t).toHaveBeenCalledWith('collibra_start', { ns: 'dates' });
    });

    it('returns an empty string when the translation echoes back the key unresolved', () => {
        const t = vi.fn((key: string) => key);
        expect(resolveDate('{{dates:missing_key}}', t)).toBe('');
    });
});

describe('parsePeriod', () => {
    it('parses a start-only period into a start Date and an undefined end', () => {
        const t = vi.fn(() => '2020-05-01');
        const result = parsePeriod(period('{{dates:x}}'), t);
        expect(result.start).toEqual(new Date('2020-05-01'));
        expect(result.end).toBeUndefined();
    });

    it('parses a period with both a start and an end', () => {
        const t = vi.fn((key: string) => (key === 'start_key' ? '2020-01-01' : '2021-01-01'));
        const result = parsePeriod(period('{{dates:start_key}}', '{{dates:end_key}}'), t);
        expect(result.start).toEqual(new Date('2020-01-01'));
        expect(result.end).toEqual(new Date('2021-01-01'));
    });

    it('falls back to the Unix epoch when the start cannot be resolved', () => {
        const t = vi.fn((key: string) => key); // echoes back, so resolveDate returns ''
        const result = parsePeriod(period('{{dates:missing}}'), t);
        expect(result.start).toEqual(new Date(0));
    });
});

describe('iconInvertsOnDark', () => {
    it.each(['/employments/dsi.png', '/education/udemy_icon.svg'])(
        'returns true for the dark-glyph icon %s',
        (icon) => {
            expect(iconInvertsOnDark(icon)).toBe(true);
        },
    );

    it.each(['/employments/collibra.jpeg', '/education/naric.svg', ''])(
        'returns undefined (not false) for a regular icon %s',
        (icon) => {
            expect(iconInvertsOnDark(icon)).toBeUndefined();
        },
    );
});

describe('iconFit', () => {
    it.each(['/employments/dsi.png', '/employments/telnet.png', '/education/udemy_icon.svg', '/education/naric.svg'])(
        'returns "contain" for the wide/tall mark %s',
        (icon) => {
            expect(iconFit(icon)).toBe('contain');
        },
    );

    it.each(['/employments/collibra.jpeg', '/education/cvo_gent.png', ''])(
        'returns undefined (not "cover") for a regular icon %s',
        (icon) => {
            expect(iconFit(icon)).toBeUndefined();
        },
    );
});

describe('currentDate', () => {
    it('returns today at midnight, local time', () => {
        const result = currentDate();
        const now = new Date();
        expect(result.getFullYear()).toBe(now.getFullYear());
        expect(result.getMonth()).toBe(now.getMonth());
        expect(result.getDate()).toBe(now.getDate());
        expect(result.getHours()).toBe(0);
        expect(result.getMinutes()).toBe(0);
        expect(result.getSeconds()).toBe(0);
    });
});
