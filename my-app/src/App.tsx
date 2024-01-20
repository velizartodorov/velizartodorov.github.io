import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import './App.css';
import Employments from './components/Employments';
import Header from './components/Header';
import Introduction from './components/Introduction';
window.React = React

export function App() {
  return (
    <>
      <Header />
      <Introduction />
      <Employments />
    </>
  );
}