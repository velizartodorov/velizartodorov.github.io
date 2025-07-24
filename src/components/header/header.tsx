import Table from 'react-bootstrap/Table';
import { useTranslation } from 'react-i18next';
import { getImageUrl } from '../common/utils';
import './header.css';
import { Link } from './link';
import ProfileItem from './profile_item';

const Header: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
    const { t } = useTranslation();
    const email = t('profile:email', { returnObjects: true }) as Link;
    const linkedIn = t('profile:linkedIn', { returnObjects: true }) as Link;
    const gitHub = t('profile:gitHub', { returnObjects: true }) as Link;
    const blog = t('profile:blog', { returnObjects: true }) as Link;
    const address = t('profile:address', { returnObjects: true }) as Link;
    const languages = t('profile:languages', { returnObjects: true }) as Link[];
    return (
        <header className="mt-3 ms-0 ms-md-4">
            <Table responsive borderless className="profile-table mb-2">
                <tbody>
                    <tr>
                        <td rowSpan={3} className="avatar-td">
                            <img className="avatar" src={getImageUrl(t('profile:imageUrl'))} alt="" />
                        </td>
                        <td colSpan={1}><h2>{t('profile:name')}</h2></td>
                        <td>{children}</td>
                    </tr>
                    <tr>
                        <td><ProfileItem link={email} /></td>
                        <td><ProfileItem link={linkedIn} /></td>
                        <td><ProfileItem link={gitHub} /></td>
                        <td><ProfileItem link={blog} /></td>
                    </tr>
                    <tr>
                        {languages.map((language: Link) => (
                            <td className="d-none d-sm-table-cell"
                                key={language.label}>
                                <ProfileItem link={language} />
                            </td>
                        ))}
                        <td className="d-none d-sm-table-cell">
                            <ProfileItem link={address} />
                        </td>
                    </tr>
                </tbody>
            </Table>
        </header>
    );
};

export default Header;