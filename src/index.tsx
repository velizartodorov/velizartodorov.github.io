import React from 'react';
import ReactDOM from 'react-dom/client';
import { I18nextProvider } from 'react-i18next';
import { App } from './App';
import './index.css';
import reportWebVitals from './reportWebVitals';

const redirectPath = globalThis.location.search
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
