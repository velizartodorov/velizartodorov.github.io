import type { Language } from '../i18n';
import { buildLanguageResources } from './build-resources';
import { EDUCATION_FILES, EMPLOYMENT_FILES, type EducationFile, type EmploymentFile } from './resource-files';
import dates from './dates.yml';

// en/ and nl/ mirror each other file-for-file, so rather than one static-import list per
// language, each yaml/markdown file is fetched through a dynamic import() templated on `lang`.
// Webpack/Turbopack resolve the enumerable set of possible paths (2 languages x N known file
// names) into separate per-file chunks, so a page still only downloads the one language's
// content it actually renders (verified via `npm run build` - each language's data lands in its
// own chunk, not both).
async function importYaml(lang: Language, name: string): Promise<any> {
    const mod = await import(`./${lang}/${name}.yml`);
    return mod.default;
}

// The ".md" suffix must stay literal in the template (not folded into the interpolated `file`
// value) - bundlers that resolve dynamic import() expressions with variables (e.g. Vite's
// dynamic-import-vars) require the extension to be part of the static text, not the variable.
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
