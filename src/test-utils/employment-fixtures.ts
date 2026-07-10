import { Employment, Position } from '../components/employments/employment';
import { period } from './period-fixtures';

// Builds a resolved Position — the shape components receive after employments.init.ts resolves
// its raw translation data (real Date objects, not "{{dates:...}}" placeholder strings). Not a
// fit for tests that need a deliberately sparse/malformed pre-resolution shape (see
// employments.init.test.ts, which constructs that raw shape directly).
export function position(overrides: Partial<Omit<Position, 'period'>> & { start: string; end?: string }): Position {
    const { start, end, ...fields } = overrides;
    return {
        position: 'Engineer',
        place: 'Remote',
        description: '',
        ...fields,
        period: period(start, end),
    };
}

export function employment(
    overrides: Partial<Omit<Employment, 'positions'>> & { positions?: Position[] } = {},
): Employment {
    return {
        company: 'Acme',
        icon: '',
        type: '',
        positions: [],
        ...overrides,
    };
}
