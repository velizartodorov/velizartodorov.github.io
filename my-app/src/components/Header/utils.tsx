import { useEffect } from 'react';
import { Envelope } from 'react-bootstrap-icons';
import { Link } from './link';
import Profile from './profile';

export function AddHeader(name: string) {
  useEffect(() => {
    document.title = name;
  }, [name]);
}

export function mailTo(mail: string) {
  return (
    <a className="no-underline" href={`mailto:${mail}`}>
      <Envelope color="royalblue" size={40} />
      <span className="envelope-margin">{mail}</span>
    </a>
  );
}

export function callTo(link: Link) {
  return (
    <a className="no-underline" href={`tel:${link.name}`}>
      <img src={link.icon} style={{ width: link.iconSize }} alt={link.name} />
      <span className="envelope-margin">{link.name}</span>
    </a>
  );
}

export function profilePicture(profile: Profile) {
  return (
    <img
      className="avatar"
      src={profile.imageUrl}
      alt=""
      style={{ width: profile.imageSize }}
    />
  );
}

export function addIconTo(link: Link) {
  return (
    <>
      <img src={link.icon} style={{ width: link.iconSize }} alt={link.name} />
      <span>{link.name}</span>
    </>
  );
}

export function linkTo(link: Link) {
  return (
    <a className="no-underline" href={link.url} target="_blank" rel="noreferrer">
      <img src={link.icon} style={{ width: link.iconSize }} alt={link.name} />
      <span className="envelope-margin">{link.name}</span>
    </a>
  );
}