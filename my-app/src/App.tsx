import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import './App.css';
import Employments from './components/Employments/Employments';
import Header from './components/Header/Header';
window.React = React

export default function App() {
  return (
    <div>
      <Header />
      <Employments />
    </div>
  );
}