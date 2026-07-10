import { IEducation } from '../components/education/education.init';
import { period } from './period-fixtures';

export function educationEntry(overrides: Partial<IEducation> = {}): IEducation {
    return {
        occupation: 'Engineering',
        institution: 'Tech University',
        place: 'Remote',
        icon: '',
        body: '',
        period: period('2018-09-01', '2020-07-01'),
        ...overrides,
    };
}
