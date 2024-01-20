import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import './App.css';
import Employments from './components/Employments';
import Header from './components/Header/header';
import Introduction from './components/Introduction/introduction';
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