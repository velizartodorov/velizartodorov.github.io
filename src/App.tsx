import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useEffect } from 'react';
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from 'react-router-dom';

import './App.css';

import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';
import { LanguageSelector } from './components/common/language_selector';
import Education from './components/education/education';
import Employments from './components/employments/employments';
import Footer from './components/footer/footer';
import Header from './components/header/header';
import Introduction from './components/introduction/introduction';
import LicensesCertifications from './components/licenses_certifications/licenses_certifications';
import { useProfile } from './components/header/profile.init';

window.React = React;

export function App() {
  const [language, setLanguage] = React.useState<'en' | 'nl'>(i18n.language as 'en' | 'nl');

  const name = useProfile().name;
  useEffect(() => {
    i18n.changeLanguage(language);
    document.title = name;
  }, [language]);

  return (
    <I18nextProvider i18n={i18n}>
      <Router basename="/">
        <Header>
          <LanguageSelector value={language} onChange={setLanguage} />
        </Header>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Introduction className="mx-4" eventKey="0" />
                <Employments className="mt-3 mx-4" eventKey="0" />
                <LicensesCertifications className="mt-3 mx-4" eventKey="1" />
                <Education className="mt-3 mx-4" eventKey="1"
                />
              </>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Footer />
      </Router>
    </I18nextProvider>
  );
}
