import Table from 'react-bootstrap/Table';
import ProfileItem from './profile_item';
import { getImageUrl } from '../common/utils';
import './header.css';
import { profile } from './profile.init';

const Header = () => {
    return (
        <header className="mt-3 ms-0 ms-md-4">
            <Table responsive borderless className="profile-table mb-2">
                <tbody>
                    <tr>
                        <td rowSpan={3} className="avatar-td">
                            <img className="avatar" src={getImageUrl(profile.imageUrl)} alt="" />
                        </td>
                        <td colSpan={4}><h2>{profile.name}</h2></td>
                    </tr>
                    <tr>
                        <td><ProfileItem link={profile.email} /></td>
                        <td><ProfileItem link={profile.linkedIn} /></td>
                        <td><ProfileItem link={profile.gitHub} /></td>
                        <td><ProfileItem link={profile.blog} /></td>
                    </tr>
                    <tr>
                        {profile.languages.map((language) => (
                            <td className="d-none d-sm-table-cell"
                                key={language.label}>
                                <ProfileItem link={language} />
                            </td>
                        ))}
                        <td className="d-none d-sm-table-cell">
                            <ProfileItem link={profile.address} />
                        </td>
                    </tr>
                </tbody>
            </Table>
        </header>
    );
};

export default Header;