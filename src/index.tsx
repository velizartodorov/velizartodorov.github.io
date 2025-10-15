import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import './index.css';
import reportWebVitals from './reportWebVitals';

const redirectPath = window.location.search
  ? window.location.search
      .slice(1)
      .replace(/~and~/g, '&')
  : null;

if (redirectPath) {
  const newUrl = window.location.origin + '/' + redirectPath;
  window.history.replaceState(null, '', newUrl);
}

// Initialize app only after i18n is ready
const initApp = async () => {
  try {
    // Import i18n and wait for it to initialize
    await import('./i18n');

    const root = ReactDOM.createRoot(
      document.getElementById('root') as HTMLElement
    );
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );

    reportWebVitals();
  } catch (error) {
    console.error('Failed to initialize application:', error);
  }
};

initApp();
