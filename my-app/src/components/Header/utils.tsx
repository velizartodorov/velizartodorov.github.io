import { useEffect } from 'react';
import { Envelope } from 'react-bootstrap-icons';
import { Link } from './link';
import { Profile } from './profile';

export function useDocumentTitle(name: string) {
  useEffect(() => {
    document.title = name;
  }, [name]);
}

export function mailtoLink(mail: string): JSX.Element {
  return (
    <a className="no-underline" href={`mailto:${mail}`}>
      <Envelope color="royalblue" size={40} />
      <span className="text-margin">{mail}</span>
    </a>
  );
}

export function telLink(link: Link): JSX.Element {
  return (
    <a className="no-underline" href={`tel:${link.name}`}>
      <img src={link.icon} style={{ width: link.iconSize }} alt={link.name} />
      <span className="text-margin">{link.name}</span>
    </a>
  );
}

export function profilePicture(profile: Profile): JSX.Element {
  return (
    <img
      className="avatar"
      src={profile.imageUrl}
      alt=""
      style={{ width: profile.imageSize }}
    />
  );
}

export function iconWithText(link: Link): JSX.Element {
  return (
    <>
      <img src={link.icon} style={{ width: link.iconSize }} alt={link.name} />
      <span className="text-margin">{link.name}</span>
    </>
  );
}

export function linkTo(link: Link): JSX.Element {
  return (
    <a className="no-underline" href={link.url} target="_blank" rel="noreferrer">
      <img src={link.icon} style={{ width: link.iconSize }} alt={link.name} />
      <span className="text-margin">{link.name}</span>
    </a>
  );
}