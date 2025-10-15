
import i18n from 'i18next';
import Backend from 'i18next-http-backend';
import { initReactI18next } from 'react-i18next';

// Types & Constants
type Language = 'en' | 'nl';
const SUPPORTED_LANGUAGES: Language[] = ['en', 'nl'];
const DEFAULT_LANGUAGE: Language = 'en';

const NAMESPACES = [
  'common',
  'employments',
  'education',
  'licenses_certifications',
  'profile',
  'languages',
  'presentations',
  'introduction',
  'dates',
] as const;

// Types for imports
interface TranslationModule {
  default: Record<string, any>;
}

// Helper to load all JSON files from a directory
const loadAllTranslations = async () => {
  const translationModules = import.meta.glob<TranslationModule>([
    './translations/**/*.json',
    '!./translations/**/employments/**/*.json', // Exclude employment files as they're handled separately
    './translations/dates.json'
  ]);

  for (const [path, importModule] of Object.entries(translationModules)) {
    try {
      const module = await importModule();
      
      // Parse the path to get language and namespace
      const matches = path.match(/\/translations\/(?:([^/]+)\/)?([^/]+)\.json$/);
      if (!matches) continue;
      
      const [, lang = DEFAULT_LANGUAGE, fileName] = matches;
      
      // Handle special cases
      if (fileName === 'dates') {
        i18n.addResourceBundle(DEFAULT_LANGUAGE, 'dates', module.default, true, true);
        continue;
      }
      
      if (fileName === 'employments') {
        // Store employment index for later processing
        continue;
      }
      
      // Add regular namespace translations
      const namespace = fileName.replace('.json', '');
      i18n.addResourceBundle(lang as Language, namespace, module.default, true, true);
    } catch (error) {
      console.error(`Error loading translation file ${path}:`, error);
    }
  }
};

interface EmploymentIndex {
  title: string;
  list: string[];
}

interface EmploymentData {
  index?: EmploymentIndex;
  items?: Record<string, any>[];
}

// Load employments separately due to their special structure
const loadEmployments = async () => {
  // First, load the main employment index files
  const indexModules = import.meta.glob<TranslationModule>('./translations/*/employments.json');
  const itemModules = import.meta.glob<TranslationModule>('./translations/*/employments/*.json');

  const employmentsByLang: Record<string, EmploymentData> = {};

  // Load index files first
  for (const [path, importModule] of Object.entries(indexModules)) {
    try {
      const module = await importModule();
      const langMatch = path.match(/\.\/translations\/([^/]+)\/employments\.json/);
      if (!langMatch) continue;
      
      const lang = langMatch[1];
      const indexData = module.default as EmploymentIndex;
      employmentsByLang[lang] = { 
        index: indexData,
        items: []
      };
    } catch (error) {
      console.error(`Error loading employment index file ${path}:`, error);
    }
  }

  // Create a map to store loaded employment files
  const employmentFileMap: Record<string, Record<string, any>> = {};

  // Load all employment files into the map
  for (const [path, importModule] of Object.entries(itemModules)) {
    try {
      const module = await importModule();
      const fileName = path.split('/').pop() || '';
      employmentFileMap[fileName] = module.default;
    } catch (error) {
      console.error(`Error loading employment file ${path}:`, error);
    }
  }

  // Add employment resources in the order specified by the index files
  Object.entries(employmentsByLang).forEach(([lang, data]) => {
    if (data.index) {
      const orderedItems = data.index.list
        .map(fileName => employmentFileMap[fileName])
        .filter(item => item); // Remove any undefined items

      i18n.addResourceBundle(lang as Language, 'employments', {
        title: data.index.title,
        list: orderedItems
      }, true, true);
    }
  });
};

const loadTranslations = async () => {
  await Promise.all([
    loadAllTranslations(),
    loadEmployments()
  ]);
};

i18n
  .use(initReactI18next)
  .init({
    lng: DEFAULT_LANGUAGE,
    fallbackLng: DEFAULT_LANGUAGE,
    ns: NAMESPACES,
    defaultNS: 'common',
    interpolation: { escapeValue: false },
  });

// Initialize i18n asynchronously
const initI18n = async () => {
  try {
    await i18n
      .use(initReactI18next)
      .init({
        lng: DEFAULT_LANGUAGE,
        fallbackLng: DEFAULT_LANGUAGE,
        ns: NAMESPACES,
        defaultNS: 'common',
        interpolation: { escapeValue: false },
      });

    await Promise.all(SUPPORTED_LANGUAGES.map(loadTranslations));
    return i18n;
  } catch (error) {
    console.error('Failed to initialize i18n:', error);
    throw error;
  }
};

// Export the i18n instance and initialization promise
export const i18nInstance = initI18n();
export default i18n;