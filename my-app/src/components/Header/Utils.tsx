import { Envelope } from 'react-bootstrap-icons';
import Profile from './Profile';
import { Link } from "./Link";

export function mailTo(mail: string) {
    return <a className="no-underline"
        href={"mailto:" + mail}>
        <a><Envelope color="royalblue" size={40} /></a>
        <a className='envelope-margin no-underline'>{mail}</a>
    </a>;
}

export function callTo(link: Link) {
    return <a className="no-underline"
        href={"tel:" + link.name}>
        <a> <img src={link.icon}
            style={{ width: link.iconSize }}></img></a>
        <a className="envelope-margin no-underline">{link.name}</a>
    </a>;
}

export function profilePicture(profile: Profile) {
    return <><img
        className="avatar"
        src={profile.imageUrl}
        alt={'Photo of ' + profile.name}
        style={{
            width: profile.imageSize,
        }}></img></>;
}

export function icon(link: Link) {
    return <><a> <img
        src={link.icon}
        style={{ width: link.iconSize }}>
    </img></a><a> {link.name}</a></>;
}

export function linkTo(link: Link) {
    return <a className="no-underline"
        href={link.url}
        target="_blank">
        <a> <img
            src={link.icon}
            style={{
                width: link.iconSize
            }}></img></a>
        <a className="envelope-margin no-underline">{link.name}</a>
    </a>;
}
