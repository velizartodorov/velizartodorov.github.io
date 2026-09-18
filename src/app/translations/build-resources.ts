import type { Employment, Position } from '../../components/employments/employment';
import type { EducationFile, EmploymentFile } from './resource-files';

export interface Index {
    title: string;
    list: string[];
}

export type RawPosition = Omit<Position, 'period' | 'description'> & { period: { start: string; end?: string } };

export type RawEmployment = Omit<Employment, 'positions'> & { positions: RawPosition[]; body: string };

const POSITION_DELIMITER = /\n\n<!-- position -->\n\n/;

function assembleEmployment(raw: RawEmployment) {
    const bodies = raw.body.split(POSITION_DELIMITER);
    if (bodies.length !== raw.positions.length) {
        throw new Error(
            `${raw.company}: found ${bodies.length} position body segment(s) but ${raw.positions.length} ` +
                `position(s) in frontmatter - check the "<!-- position -->" delimiters in the markdown file.`,
        );
    }
    return {
        company: raw.company,
        icon: raw.icon,
        type: raw.type,
        positions: raw.positions.map((position, i) => ({ ...position, description: bodies[i] ?? '' })),
    };
}

export function buildEmployments(index: Index, items: Record<EmploymentFile, RawEmployment>) {
    return {
        title: index.title,
        list: index.list
            .map((fileName) => items[fileName as EmploymentFile])
            .filter((item): item is RawEmployment => Boolean(item))
            .map(assembleEmployment),
    };
}

export function buildEducation(index: Index, items: Record<EducationFile, unknown>) {
    return {
        title: index.title,
        list: index.list.map((fileName) => items[fileName as EducationFile]).filter(Boolean),
    };
}

interface LanguageModules {
    employmentsIndex: Index;
    employmentItems: Record<EmploymentFile, RawEmployment>;
    educationIndex: Index;
    educationItems: Record<EducationFile, unknown>;
}

export function buildLanguageResources<T extends LanguageModules>(modules: T) {
    const { employmentsIndex, employmentItems, educationIndex, educationItems, ...rest } = modules;
    return {
        ...rest,
        employments: buildEmployments(employmentsIndex, employmentItems),
        education: buildEducation(educationIndex, educationItems),
    };
}
