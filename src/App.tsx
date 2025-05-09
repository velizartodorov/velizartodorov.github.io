import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';

import './App.css';
import Education from './components/education/education';
import Employments from './components/employments/employments';
import Footer from './components/footer/footer';
import Header from './components/header/header';
import { profile } from './components/header/profile.init';
import Introduction from './components/introduction/introduction';
import LicensesCertifications from './components/licenses_certifications/licenses_certifications';

window.React = React;

export function App() {
  useEffect(() => {
    document.title = profile.name;
  }, []);

  return (
    <Router basename="/">
      <Header />
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Introduction />
              <Employments />
              <LicensesCertifications />
              <Education />
            </>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Footer />
    </Router>
  );
}
