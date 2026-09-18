import { type Language, LANGUAGES } from './languages';
import { buildLanguageResources } from './build-resources';
import { EDUCATION_FILES, EMPLOYMENT_FILES, type EducationFile, type EmploymentFile } from './resource-files';
import dates from './dates.yml';

async function importYaml(lang: Language, name: string): Promise<any> {
    const mod = await import(`./${lang}/${name}.yml`);
    return mod.default;
}

async function importEmployment(lang: Language, file: EmploymentFile): Promise<any> {
    const mod = await import(`./${lang}/employments/${file.replace(/\.md$/, '')}.md`);
    return mod.default;
}

async function importEducation(lang: Language, file: EducationFile): Promise<any> {
    const mod = await import(`./${lang}/education/${file.replace(/\.md$/, '')}.md`);
    return mod.default;
}

export async function loadResources(lang: Language) {
    const [
        common,
        educationIndex,
        employmentsIndex,
        introduction,
        languages,
        licenses_certifications,
        presentations,
        profile,
    ] = await Promise.all([
        importYaml(lang, 'common'),
        importYaml(lang, 'education'),
        importYaml(lang, 'employments'),
        importYaml(lang, 'introduction'),
        importYaml(lang, 'languages'),
        importYaml(lang, 'licenses_certifications'),
        importYaml(lang, 'presentations'),
        importYaml(lang, 'profile'),
    ]);

    const employmentEntries = await Promise.all(
        EMPLOYMENT_FILES.map(async (file) => [file, await importEmployment(lang, file)] as const),
    );
    const educationEntries = await Promise.all(
        EDUCATION_FILES.map(async (file) => [file, await importEducation(lang, file)] as const),
    );

    return buildLanguageResources({
        common,
        educationIndex,
        educationItems: Object.fromEntries(educationEntries) as Record<EducationFile, unknown>,
        employmentsIndex,
        employmentItems: Object.fromEntries(employmentEntries) as Record<EmploymentFile, never>,
        introduction,
        languages,
        licenses_certifications,
        presentations,
        profile,
        dates,
    });
}

export type Strings = (lang: Language, key: string) => unknown;

export async function loadAllStrings(): Promise<Strings> {
    const entries = await Promise.all(LANGUAGES.map(async (lang) => [lang, await loadResources(lang)] as const));
    const byLang = Object.fromEntries(entries) as Record<Language, Awaited<ReturnType<typeof loadResources>>>;

    return (lang, key) => {
        const colon = key.indexOf(':');
        const namespace = colon === -1 ? key : key.slice(0, colon);
        const dottedPath = colon === -1 ? '' : key.slice(colon + 1);
        const root = (byLang[lang] as Record<string, unknown>)[namespace];
        if (dottedPath === '') return root;
        return dottedPath
            .split('.')
            .reduce<unknown>((node, part) => (node as Record<string, unknown> | undefined)?.[part], root);
    };
}
