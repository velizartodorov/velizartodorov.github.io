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

// ───────────────────────────────────────────
// Helpers for interpolation
// ───────────────────────────────────────────
function getByPath(obj: any, path: string) {
  const parts = path.split(/[.:]/g).filter(Boolean);
  return parts.reduce((acc, k) => (acc != null ? acc[k] : undefined), obj);
}

function interpolateString(str: string, ctx: Record<string, any>) {
  return str.replace(/\{\{\s*([a-zA-Z0-9_.:-]+)\s*\}\}/g, (_m, keyPath) => {
    const val = getByPath(ctx, keyPath);
    return val == null ? '' : String(val);
  });
}

function deepInterpolate(node: any, ctx: Record<string, any>): any {
  if (typeof node === 'string') return interpolateString(node, ctx);
  if (Array.isArray(node)) return node.map(v => deepInterpolate(v, ctx));
  if (node && typeof node === 'object') {
    const out: any = {};
    for (const [k, v] of Object.entries(node)) {
      out[k] = deepInterpolate(v, ctx);
    }
    return out;
  }
  return node;
}

// ───────────────────────────────────────────
// Backend load path + parser
// ───────────────────────────────────────────
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

// ───────────────────────────────────────────
// Employment loader with interpolation
// ───────────────────────────────────────────
interface EmploymentIndex {
  title?: string;
  list?: string[];
}

async function loadAndRegisterEmployments(lang: string) {
  try {
    const prefix = process.env.PUBLIC_URL || '';
    console.debug(`Loading employments for ${lang}`);

    // Load index file
    const indexPath = `${prefix}/translations/${lang}/employments.yml`;
    const indexRes = await fetch(indexPath);
    if (!indexRes.ok) throw new Error(`Failed to fetch employment index: ${indexRes.status}`);

    const indexText = await indexRes.text();
    const index = yaml.load(indexText) as EmploymentIndex;
    if (!index || !Array.isArray(index.list)) throw new Error('Invalid employment index structure');

    console.debug(`Found ${index.list.length} employment files`);

    // Load context for interpolation: dates + common
    const dates = i18n.getResourceBundle(lang, 'dates') ?? {};
    const common = i18n.getResourceBundle(lang, 'common') ?? {};
    const ctx = { dates, common };

    const items = await Promise.all(
      index.list.map(async file => {
        try {
          const filePath = `${prefix}/translations/${lang}/employments/${file}`;
          const res = await fetch(filePath);
          if (!res.ok) throw new Error(`HTTP ${res.status}`);

          const txt = await res.text();
          let data: any = yaml.load(txt);
          if (!data || typeof data !== 'object') throw new Error('Invalid YAML structure');

          // Interpolate placeholders from dates/common
          data = deepInterpolate(data, ctx);

          // Basic field check
          if (!data.position || !data.company || !data.period) {
            throw new Error('Missing required fields');
          }

          console.debug(`Loaded employment: ${data.position} at ${data.company}`);
          return data;
        } catch (error) {
          console.error(`Failed to load employment ${file}:`, error);
          return null;
        }
      })
    );

    const validItems = items.filter(Boolean);
    if (!validItems.length) throw new Error('No valid employment items loaded');

    i18n.addResourceBundle(lang, 'employments', { title: index.title ?? '', list: validItems }, true, true);
    console.debug(`Registered employments for ${lang}`);
  } catch (error) {
    console.error(`Failed to load employments for ${lang}:`, error);
  }
}

// ───────────────────────────────────────────
// i18n init
// ───────────────────────────────────────────
async function initializeI18n() {
  try {
    console.debug('Initializing i18n');

    await i18n
      .use(Backend)
      .use(initReactI18next)
      .init({
        lng: 'en',
        fallbackLng: 'en',
        ns: NAMESPACES,
        defaultNS: 'common',
        debug: true,
        interpolation: { escapeValue: false },
        backend: {
          loadPath: customLoadPath,
          parse: parseWithYaml,
        },
      });

    // Explicitly load key namespaces for all languages we support
    const languages = ['en', 'nl'];
    await Promise.all(
      languages.map(lang => i18n.loadNamespaces(['common', 'dates']))
    );

    // Load employments for all supported languages
    await Promise.all(languages.map(lang => loadAndRegisterEmployments(lang)));

    console.debug('All resources loaded');
  } catch (error) {
    console.error('Failed to initialize i18n:', error);
  }
}

void initializeI18n();

export default i18n;
