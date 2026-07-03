import { Link } from './link';
import React from "react";

const ProfileItem: React.FC<{ link: Link }> = ({ link }) => {
    const content = (
        <span className="inline-flex items-center justify-start">
            <img
                src={link.icon}
                style={{ width: link.width }}
                alt={link.label}
                className={`block shrink-0 ${link.invertInDarkMode ? 'dark:invert' : ''}`}
            />
            <span className="ml-2 max-[240px]:ml-[0.2rem] max-[240px]:text-[0.7rem]">{link.label}</span>
        </span>
    );
    return link.url ? (
        <a className="no-underline hover:no-underline" href={link.url} target="_blank" rel="noreferrer">
            {content}
        </a>
    ) : (
        <span>{content}</span>
    );
};

export default ProfileItem;
