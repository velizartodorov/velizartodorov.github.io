import { Period } from '../common/period';

export interface Position {
    position: string;
    place: string;
    period: Period;
    description: string;
}

export interface Employment {
    company: string;
    icon: string;
    type: string;
    positions: Array<Position>;
}
