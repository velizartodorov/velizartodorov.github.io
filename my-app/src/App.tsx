import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import './App.css';
import Header from './components/header/header';
import Employments from './components/employments/employments';
import Education from './components/education/education';
import Footer from './components/footer/footer';
import Introduction from './components/introduction/introduction';
import LicensesCertifications from './components/licenses_certification/licenses_certifications';
window.React = React

export function App() {
  return (
    <>
      <Header />
      <Introduction />
      <Employments />
      <LicensesCertifications />
      <Education />
      <Footer />
    </>
  );
}