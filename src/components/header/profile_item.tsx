import { Link } from './link';
import './profile_item.css';

const ProfileItem: React.FC<{ link: Link }> = ({ link }) => {
    const content = (
        <span className="profile-item-content">
            <img src={link.icon} style={{ width: link.width }} alt={link.label} />
            <span className="text-margin">{link.label}</span>
        </span>
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
