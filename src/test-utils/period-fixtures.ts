import { Period } from '../components/common/period';

// A resolved Period (real Date objects) built from ISO date strings — the shape components
// actually receive after employments.init.ts/education.init.ts resolve their raw translation data.
export function period(start: string, end?: string): Period {
    return { start: new Date(start), end: end ? new Date(end) : undefined };
}
