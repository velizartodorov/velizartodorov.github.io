import Table from 'react-bootstrap/Table';
import ProfileAttribute from '../common/profile_attribute';
import './header.css';
import { profile } from './profile.init';

const Header = () => {
    const imageUrl = process.env.PUBLIC_URL + profile.imageUrl
    return (
        <header className="mt-3 ms-0 ms-md-4">
            <Table responsive borderless className="profile-table mb-2">
                <tbody>
                    <tr>
                        <td rowSpan={3} className="avatar-td">
                            <img className="avatar" src={imageUrl} alt="" />
                        </td>
                        <td><h2>{profile.name}</h2></td>
                    </tr>
                    <tr>
                        <td><ProfileAttribute link={profile.email} /></td>
                        <td><ProfileAttribute link={profile.linkedIn} /></td>
                        <td><ProfileAttribute link={profile.gitHub} /></td>
                        <td><ProfileAttribute link={profile.blog} /></td>
                    </tr>
                    <tr>
                        {profile.languages.map((language) => (
                            <td className="d-none d-sm-table-cell" key={language.label}>
                                <ProfileAttribute link={language} />
                            </td>
                        ))}
                        <td className="d-none d-sm-table-cell">
                            <ProfileAttribute link={profile.address} />
                        </td>
                    </tr>
                </tbody>
            </Table>
        </header>
    );
};

export default Header;

