import React from 'react';
import { Link } from '../header/link';
import { getImageUrl } from '../common/utils';

const ProfileItem: React.FC<{ link: Link }> = ({ link }) => {
    const content = (
        <>
            <img src={getImageUrl(link.icon)} style={{ width: link.width }} alt={link.label} />
            <span className="text-margin">{link.label}</span>
        </>
    );
    return link.url ? (
        <a className="no-underline" href={link.url} target="_blank" rel="noreferrer">
            {content}
        </a>
    ) : (
        <span>{content}</span>
    );
};

export default ProfileItem;
