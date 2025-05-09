import React from 'react';
import { Link } from '../header/link';

const ProfileAttribute: React.FC<{ link: Link }> = ({ link }) => {
    const iconSrc = process.env.PUBLIC_URL + link.icon;

    return link.url ? (
        <a className="no-underline" href={link.url} target="_blank" rel="noreferrer">
            <img src={iconSrc} style={{ width: link.width }} alt={link.label} />
            <span className="text-margin">{link.label}</span>
        </a>
    ) : (
        <>
            <img src={iconSrc} style={{ width: link.width }} alt={link.label} />
            <span className="text-margin">{link.label}</span>
        </>
    );
};

export default ProfileAttribute;