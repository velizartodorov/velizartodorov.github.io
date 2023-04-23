import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import './App.css';
import Employments from './components/Employments';
import Header from './components/Header';
window.React = React

export function App() {
  return (
    <>
      <Header />
      <Employments />
    </>
  );
}