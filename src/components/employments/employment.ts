import { Period } from '../common/period';
import { Reference } from '../common/reference';

export interface Position {
    position: string;
    place: string;
    period: Period;
    description: Array<string>;
    references: Array<Reference>;
}

export interface Employment {
    company: string;
    icon: string;
    type: string;
    positions: Array<Position>;
}
