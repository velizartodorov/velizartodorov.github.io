import 'bootstrap/dist/css/bootstrap.min.css';
import React, { lazy, Suspense, useEffect } from 'react';
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import { LanguageSelector } from './components/common/language_selector';
import Footer from './components/footer/footer';
import Header from './components/header/header';
import Introduction from './components/introduction/introduction';
import { useProfile } from './components/header/profile.init';
import EnvBanner from './components/common/env_banner';

const Employments = lazy(() => import('./components/employments/employments'));
const LicensesCertifications = lazy(() => import('./components/licenses_certifications/licenses_certifications'));
const Presentations = lazy(() => import('./components/presentations/presentations'));
const Languages = lazy(() => import('./components/languages/languages'));
const Education = lazy(() => import('./components/education/education'));

globalThis.React = React;

export function App() {
  const { name } = useProfile();
  useEffect(() => {
    document.title = name;
  }, [name]);

  return (
    <Router basename="/">
      <Header>
        <LanguageSelector />
      </Header>
      <Routes>
        <Route
          path="/"
          element={
            <Suspense fallback={null}>
              <Introduction className="mx-4" eventKey="0" />
              <Employments className="mt-3 mx-4" eventKey="1" />
              <LicensesCertifications className="mt-3 mx-4" eventKey="2" />
              <Presentations className="mt-3 mx-4" eventKey="3" />
              <Languages className="mt-3 mx-4" eventKey="4" />
              <Education className="mt-3 mx-4" eventKey="5" />
            </Suspense>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <EnvBanner />
      <Footer />
    </Router>
  );
}
