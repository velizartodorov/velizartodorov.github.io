import Table from 'react-bootstrap/Table';

import { LanguageSelector } from '../common/language_selector';
import './header.css';
import { useProfile } from './profile.init';
import ProfileItem from './profile_item';

const Header: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
    const profile = useProfile();
    return (
        <header className="mt-3 ms-0 ms-md-4">
            <Table responsive borderless className="profile-table mb-2">
                <tbody>
                    <tr>
                        <td rowSpan={3} className="avatar-td">
                            <img className="avatar" src={profile.imageUrl} alt="" />
                        </td>
                        <td colSpan={3}><h2>{profile.name}</h2></td>
                    </tr>
                    <tr>
                        <td><LanguageSelector /></td>
                        <td><ProfileItem link={profile.email} /></td>
                        <td><ProfileItem link={profile.linkedIn} /></td>
                    </tr>
                    <tr>
                        <td><ProfileItem link={profile.gitHub} /></td>
                        <td><ProfileItem link={profile.blog} /></td>
                        <td><ProfileItem link={profile.address} /></td>
                    </tr>
                </tbody>
            </Table>
        </header>
    );
};

export default Header;