import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';
import yaml from 'js-yaml';
const NAMESPACES = [
  'common',
  'employments',
  'education',
  'licenses_certifications',
  'profile',
  'presentations',
  'introduction',
  'dates',
];

function customLoadPath(lngs: string, namespaces: string | string[]): string {
  const ns = Array.isArray(namespaces) ? namespaces[0] : namespaces;
  if (ns === 'dates') return '/translations/dates.yml';
  return `/translations/${lngs}/${ns}.yml`;
}

function parseWithYaml(data: string, url: string) {
  if (url.endsWith('.yml') || url.endsWith('.yaml')) {
    const parsed = yaml.load(data);
    return parsed && typeof parsed === 'object' ? parsed : {};
  }
  try {
    return JSON.parse(data);
  } catch {
    return {};
  }
}

interface EmploymentIndex {
  title?: string;
  list?: string[];
}

// Fetch index + item files and register the combined bundle
async function loadAndRegisterEmployments(lang: string) {
  // /public/translations/<lang>/employments.yml
  const indexRes = await fetch(`/translations/${lang}/employments.yml`);
  if (!indexRes.ok) {
    return;
  }

  const indexText = await indexRes.text();
  const index = yaml.load(indexText) as EmploymentIndex | null;

  const files = Array.isArray(index?.list) ? index!.list : [];

  const items = await Promise.all(
    files.map(async (file) => {
      const res = await fetch(`/translations/${lang}/employments/${file}`);
      if (!res.ok) return {};
      const txt = await res.text();
      const obj = yaml.load(txt) as any;
      return obj ?? {};
    })
  );

  i18n.addResourceBundle(
    lang,
    'employments',
    { title: index?.title ?? '', list: items },
    true,   // deep
    true    // overwrite
  );
}

i18n
  .use(Backend)
  .use(initReactI18next)
  .init({
    lng: 'en',
    fallbackLng: 'en',
    ns: NAMESPACES,
    defaultNS: 'common',
    interpolation: {
      escapeValue: false,
    },
    backend: {
      loadPath: customLoadPath,
      parse: parseWithYaml,
    },
  });

void Promise.all(['en', 'nl'].map((lang) => loadAndRegisterEmployments(lang)));

export default i18n;
