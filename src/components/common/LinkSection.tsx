import React from 'react';
import { Link } from '../header/link';

const ProfileAttribute: React.FC<{ link: Link }> = ({ link }) => {
    return link.url ? (
        <a className="no-underline" href={link.href} target="_blank" rel="noreferrer">
            <img src={link.icon} style={{ width: link.width }} alt={link.label} />
            <span className="text-margin">{link.label}</span>
        </a>
    ) : (
        <>
            <img src={link.icon} style={{ width: link.width }} alt={link.label} />
            <span className="text-margin">{link.label}</span>
        </>
    );
};

export default ProfileAttribute;