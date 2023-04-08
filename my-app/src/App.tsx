import React from 'react';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import './App.css';
import Profile from './Profile';
window.React = React

export default function Header() {
  return (
    <>
      <header className="header">
        <Container>
          <Row>
            <Col> <h1>{Profile.name}</h1>
            </Col>
            <Col> <h1>{Profile.birthday}</h1>
            </Col>
            <Col> <h1>{Profile.drivingLicense}</h1>
            </Col>
          </Row>
          <Row>
            <Col> <h1>{Profile.email}</h1>
            </Col>
            <Col> <h1>{Profile.phone}</h1>
            </Col>
            <Col> <h1>{Profile.residense}</h1>
            </Col>
          </Row>
          <Row>
            <Col> <h1>{Profile.linkedIn}</h1>
            </Col>
            <Col> <h1>{Profile.gitHub}</h1>
            </Col>
            <Col> <h1>{Profile.blog}</h1>
            </Col>
          </Row>
        </Container>
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
      height: Profile.imageSize
    }}></img>
}
