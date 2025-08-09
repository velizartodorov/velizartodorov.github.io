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

async function loadAndRegisterEmployments(lang: string) {
  try {
    const prefix = process.env.PUBLIC_URL || '';
    console.debug(`Loading employments for ${lang}`);

    // Load index file
    const indexPath = `${prefix}/translations/${lang}/employments.yml`;
    console.debug(`Fetching employment index from: ${indexPath}`);
    const indexRes = await fetch(indexPath);
    
    if (!indexRes.ok) {
      throw new Error(`Failed to fetch employment index: ${indexRes.status}`);
    }

    const indexText = await indexRes.text();
    console.debug(`Raw index text: ${indexText}`);
    
    let index: EmploymentIndex;
    
    try {
      index = yaml.load(indexText) as EmploymentIndex;
      console.debug(`Parsed employment index:`, index);
      
      if (!index || !Array.isArray(index.list)) {
        throw new Error('Invalid employment index structure');
      }
    } catch (error) {
      console.error(`Failed to parse employment index:`, error);
      throw error;
    }

    console.debug(`Found ${index.list.length} employment files to load`);

    const items = await Promise.all(
      index.list.map(async (file) => {
        try {
          const filePath = `${prefix}/translations/${lang}/employments/${file}`;
          console.debug(`Loading employment file: ${filePath}`);
          
          const res = await fetch(filePath);
          if (!res.ok) {
            throw new Error(`HTTP ${res.status}`);
          }
          
          const txt = await res.text();
          console.debug(`Raw employment file content (first 200 chars): ${txt.substring(0, 200)}...`);
          
          let data: any;
          
          try {
            data = yaml.load(txt);
            if (!data || typeof data !== 'object') {
              throw new Error('Invalid YAML structure');
            }
            
            // Validate required fields
            if (!data.position || !data.company || !data.period) {
              throw new Error('Missing required fields');
            }
            
            console.debug(`Successfully parsed employment: ${data.position} at ${data.company}`);
            return data;
          } catch (error) {
            console.error(`Failed to parse employment file ${file}:`, error);
            throw error;
          }
        } catch (error) {
          console.error(`Failed to load employment ${file}:`, error);
          return null;
        }
      })
    );

    // Filter out failed loads
    const validItems = items.filter(item => item !== null);
    
    if (validItems.length === 0) {
      throw new Error('No valid employment items loaded');
    }

    console.debug(`Successfully loaded ${validItems.length}/${items.length} employment items`);

    // Register the bundle
    const bundle = {
      title: index.title ?? '',
      list: validItems
    };
    console.debug(`Registering employment bundle for ${lang}:`, bundle);
    
    i18n.addResourceBundle(
      lang,
      'employments',
      bundle,
      true,   // deep
      true    // overwrite
    );

    console.debug(`Successfully registered employment bundle for ${lang}`);
    
    // Verify the bundle was registered
    const registeredBundle = i18n.getResourceBundle(lang, 'employments');
    console.debug(`Verification - registered bundle for ${lang}:`, registeredBundle);
    
  } catch (error) {
    console.error(`Failed to load employments for ${lang}:`, error);
  }
}

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
        interpolation: {
          escapeValue: false,
        },
        backend: {
          loadPath: customLoadPath,
          parse: parseWithYaml,
        },
      });

    console.debug('i18n initialized, loading common namespace');
    
    // Explicitly load common namespace for all languages
    await Promise.all(['en', 'nl'].map(lang => i18n.loadNamespaces(['common'])));
    
    console.debug('Common namespace loaded, loading dates namespace');
    
    // Explicitly load dates namespace for all languages
    await Promise.all(['en', 'nl'].map(lang => i18n.loadNamespaces(['dates'])));
    
    console.debug('Dates namespace loaded, loading employments');
    
    // Load employments after i18n is initialized
    await Promise.all(['en', 'nl'].map(lang => loadAndRegisterEmployments(lang)));
    
    console.debug('Employments loaded, checking final state');
    
    // Check the final state of all resources
    console.debug('All resources loaded:', 
      i18n.languages.map(lang => ({
        lang,
        namespaces: NAMESPACES.map(ns => ({
          ns,
          loaded: i18n.hasResourceBundle(lang, ns),
          resources: i18n.getResourceBundle(lang, ns)
        }))
      }))
    );
    
    // Specifically check employment bundles
    console.debug('Employment bundles after loading:');
    ['en', 'nl'].forEach(lang => {
      const bundle = i18n.getResourceBundle(lang, 'employments');
      console.debug(`Language ${lang}:`, {
        hasBundle: !!bundle,
        bundle: bundle,
        listLength: bundle?.list?.length || 0
      });
    });
    
  } catch (error) {
    console.error('Failed to initialize i18n:', error);
  }
}

void initializeI18n();

export default i18n;
