import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useEffect } from 'react';
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from 'react-router-dom';

import './App.css';

import Education from './components/education/education';
import Employments from './components/employments/employments';
import Footer from './components/footer/footer';
import Header from './components/header/header';
import { profile } from './components/header/profile.init';
import Introduction from './components/introduction/introduction';
import LicensesCertifications from './components/licenses_certifications/licenses_certifications';
import { LanguageSelector, LanguageContext } from './components/common/language_selector';

window.React = React;

export function App() {
  const [language, setLanguage] = React.useState<'en' | 'nl'>('en');

  useEffect(() => {
    document.title = profile.name;
  }, []);

  return (
    <LanguageContext.Provider value={{ language }}>
      <Router basename="/">
        <div className="d-flex justify-content-end p-2">
          <LanguageSelector value={language} onChange={setLanguage} />
        </div>
        <Header />
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Introduction className="mx-4" eventKey="0" />
                <Employments className="mt-3 mx-4" eventKey="0" />
                <LicensesCertifications title="Licenses & certifications 🔖" className="mt-3 mx-4" eventKey="1" />
                <Education title="Education 🦉" className="mt-3 mx-4" eventKey="1" />
              </>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Footer />
      </Router>
    </LanguageContext.Provider>
  );
}
