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

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();
