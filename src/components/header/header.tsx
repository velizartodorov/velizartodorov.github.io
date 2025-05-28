import Table from 'react-bootstrap/Table';
import ProfileAttribute from '../common/profile_attribute';
import './header.css';
import { profile } from './profile.init';

const Header = () => {
    const imageUrl = process.env.PUBLIC_URL + profile.imageUrl
    return (
        <header className="header">
            <Table responsive borderless>
                <tbody>
                    <tr>
                        <td rowSpan={3} className="avatar-td">
                            <img
                                className="avatar"
                                src={imageUrl}
                                alt=""
                            />
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
                            <td key={language.label}>
                                {<ProfileAttribute link={language} />}
                            </td>
                        ))}
                        <td><ProfileAttribute link={profile.address} /></td>
                    </tr>
                </tbody>
            </Table>
        </header>
    );
};

export default Header;

