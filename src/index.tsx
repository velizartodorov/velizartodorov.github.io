import React from 'react';
import ReactDOM from 'react-dom/client';
import { I18nextProvider } from 'react-i18next';
import { App } from './App';
import './index.css';
import reportWebVitals from './reportWebVitals';

const search = globalThis.location.search;

// GitHub Pages SPA redirect: 404.html encodes the path as the bare query string with no '='.
// Re-decode it back to the real path so React Router sees the right URL.
const isPathRedirect = search.length > 0 && !search.slice(1).includes('=');
const redirectPath = isPathRedirect
  ? search.slice(1).replaceAll('~and~', '&')
  : null;

if (redirectPath) {
  const newUrl = globalThis.location.origin + '/' + redirectPath;
  globalThis.history.replaceState(null, '', newUrl);
}

// Backward compat: ?lang=nl links redirect to the /nl subpath.
if (!isPathRedirect && search) {
  const langParam = new URLSearchParams(search).get('lang');
  if (langParam === 'nl') {
    globalThis.history.replaceState(null, '', globalThis.location.origin + '/nl');
  } else if (langParam === 'en') {
    const cleanUrl = new URL(globalThis.location.href);
    cleanUrl.searchParams.delete('lang');
    globalThis.history.replaceState(null, '', cleanUrl.toString());
  }
}

const initApp = async () => {
  try {
    const { i18nInstance, default: i18n } = await import('./i18n');
    await i18nInstance;

    const pathname = globalThis.location.pathname;
    if (pathname === '/nl' || pathname.startsWith('/nl/')) {
      await i18n.changeLanguage('nl');
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
