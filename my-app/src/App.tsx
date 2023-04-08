import React from 'react';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import './App.css';
window.React = React


const profile = {
  name: 'Velizar Todorov',
  imageUrl: '/velizar-photo.jpg',
  email: 'veltodorov@outlook.com',
  imageSize: 200,
};

export default function Profile() {
  return (
    <>
      <header className="header">
        <Container>
          <Row>
            <Col>
             <ProfilePicture></ProfilePicture>
            </Col>
            <Col> <h1>{profile.name}</h1></Col>
          </Row>
        </Container>
      </header>
    </>
  );
}

export function ProfilePicture() {
  return <img
    className="avatar"
    src={profile.imageUrl}
    alt={'Photo of ' + profile.name}
    style={{
      width: profile.imageSize,
      height: profile.imageSize
    }}></img>
}
