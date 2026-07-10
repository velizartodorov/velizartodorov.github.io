import { Employment, Position } from '../components/employments/employment';
import { period } from './period-fixtures';

// Builds a resolved Position — the shape components receive after employments.init.ts resolves
// its raw translation data (real Date objects, not "{{dates:...}}" placeholder strings). For the
// pre-resolution raw shape itself, see rawPosition()/rawEmployment() below.
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

// Raw (pre-hook) shape: what an employments:list translation entry actually looks like before
// useEmployments() resolves period.start/end — see employments.init.test.ts, which tests that
// resolution directly. Period dates are strings (a real ISO date or a "{{dates:x}}" placeholder),
// not yet Date objects. Not a fit for tests that need a deliberately malformed employment/position
// shape (missing type, non-array positions, etc.) — those stay as raw literals on purpose, since
// this builder's own defaults would mask exactly the missing-field case being tested.
export interface RawPosition {
    position: string;
    place: string;
    description: string;
    period: { start?: string; end?: string };
}

export interface RawEmployment {
    company: string;
    icon: string;
    type?: string;
    positions: RawPosition[];
}

export function rawPosition(
    overrides: Partial<Omit<RawPosition, 'period'>> & { start?: string; end?: string } = {},
): RawPosition {
    const { start, end, ...fields } = overrides;
    return { position: 'Engineer', place: 'Remote', description: 'desc', ...fields, period: { start, end } };
}

export function rawEmployment(
    overrides: Partial<Omit<RawEmployment, 'positions'>> & { positions?: RawPosition[] } = {},
): RawEmployment {
    return { company: 'Acme', icon: '/icon.png', type: 'Full-time', positions: [], ...overrides };
}
