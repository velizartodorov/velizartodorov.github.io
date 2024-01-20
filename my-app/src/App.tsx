import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import './App.css';
import Header from './components/Header/header';
import Introduction from './components/Introduction/introduction';
import Employments from './components/Employments/employments';
import Education from './components/Education/education';
import Footer from './components/Footer/footer';
window.React = React

export function App() {
  return (
    <>
      <Header />
      <Introduction />
      <Employments />
      <Education />
      <Footer />
    </>
  );
}