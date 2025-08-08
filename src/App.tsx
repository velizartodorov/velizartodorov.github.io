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
import { LanguageSelector } from './components/common/language_selector';
import Education from './components/education/education';
import Employments from './components/employments/employments';
import Footer from './components/footer/footer';
import Header from './components/header/header';
import Introduction from './components/introduction/introduction';
import i18n from './i18n';
import { useProfile } from './components/header/profile.init';
import LicensesCertifications from './components/licenses_certifications/licenses_certifications';
import EnvBanner from './components/common/env_banner';

window.React = React;

export function App() {
  const { name } = useProfile();
  useEffect(() => {
    document.title = name;
  }, [name]);

  return (
    <I18nextProvider i18n={i18n}>
      <Router basename="/">
        <Header>
          <LanguageSelector />
        </Header>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Introduction className="mx-4" eventKey="0" />
                <Employments className="mt-3 mx-4" eventKey="1" />
                <LicensesCertifications className="mt-3 mx-4" eventKey="2" />
                <Education className="mt-3 mx-4" eventKey="3" />
              </>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <EnvBanner />
        <Footer />
      </Router>
    </I18nextProvider>
  );
}
