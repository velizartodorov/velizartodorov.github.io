import React from 'react';
import Table from 'react-bootstrap/Table';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Profile from './Profile';
window.React = React

export default function App() {
  return (
    <>
      <header className="header">
        <Table responsive borderless>
          <thead></thead>
          <tbody>
            <tr>
              <td rowSpan={4}><ProfilePicture /></td>
              <td><h1>{Profile.name}</h1></td>
              <td><h2>{Profile.birthday}</h2></td>
              <td><h2>{Profile.drivingLicense}</h2></td>
            </tr>
            <tr>
              <td><h2>{Profile.email}</h2></td>
              <td><h2>{Profile.phone}</h2></td>
              <td><h2>{Profile.residense}</h2></td>
            </tr>
            <tr>
              <td><h2>{Profile.linkedIn}</h2></td>
              <td><h2>{Profile.gitHub}</h2></td>
              <td><h2>{Profile.blog}</h2></td>
            </tr>
            <tr>
              <td><h2>{Profile.languages.english}</h2></td>
              <td><h2>{Profile.languages.dutch}</h2></td>
              <td><h2>{Profile.languages.bulgarian}</h2></td>
            </tr>
          </tbody>
        </Table>
      </header>
    </>
  );
}

export function ProfilePicture() {
  return <img
    className="avatar"
    src={Profile.imageUrl}
    alt={'Photo of ' + Profile.name}
    style={{
      width: Profile.imageSize,
    }}></img>
}
