export type Language = 'en' | 'nl';

export const LANGUAGES: readonly Language[] = ['en', 'nl'];

export function otherLanguages(lang: Language): Language[] {
    return LANGUAGES.filter((other) => other !== lang);
}
