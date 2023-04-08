import React from 'react';
import './App.css';

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
        <div className="row">
          <img
            className="avatar"
            src={profile.imageUrl}
            alt={'Photo of ' + profile.name}
            style={{
              width: profile.imageSize,
              height: profile.imageSize
            }}
          />
          <h1>{profile.name}</h1>
        </div>
      </header>
    </>
  );
}
