import React from 'react';
import ReactDOM from 'react-dom/client';
import { I18nextProvider } from 'react-i18next';
import { App } from './App';
import './index.css';
import reportWebVitals from './reportWebVitals';

const params = new URLSearchParams(globalThis.location.search);
const langParam = params.get('lang');

// GitHub Pages path redirects have empty-value entries (e.g. "?about", "?some/path")
const isPathRedirect = globalThis.location.search.length > 0
  && [...params.values()].some(v => v === '');
const redirectPath = isPathRedirect
  ? globalThis.location.search.slice(1).replaceAll('~and~', '&')
  : null;

if (redirectPath) {
  const newUrl = globalThis.location.origin + '/' + redirectPath;
  globalThis.history.replaceState(null, '', newUrl);
}

const initApp = async () => {
  try {
    const { i18nInstance, default: i18n } = await import('./i18n');
    await i18nInstance;

    if (langParam === 'en' || langParam === 'nl') {
      await i18n.changeLanguage(langParam);
    }

    const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
    root.render(
      <React.StrictMode>
        <I18nextProvider i18n={i18n}>
          <App />
        </I18nextProvider>
      </React.StrictMode>
    );

    reportWebVitals();
  } catch (error) {
    console.error('Failed to initialize application:', error);
  }
};

initApp();
