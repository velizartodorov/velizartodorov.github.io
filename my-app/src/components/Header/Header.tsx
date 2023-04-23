import Table from 'react-bootstrap/Table';
import './Header.css';
import Profile from './Profile';
import { AddHeader, addIconTo, callTo, linkTo, mailTo, profilePicture } from './Utils';

const profile = new Profile();

const Header = () => {
    AddHeader(profile.name);
    return (
        <header className="header">
            <Table responsive borderless>
                <tbody>
                    <tr>
                        <td rowSpan={4}>{profilePicture(profile)}</td>
                        <td colSpan={2}><h1>{profile.name}</h1></td>
                        <td><h4>{addIconTo(profile.birthday)}</h4></td>
                        <td><h4>{addIconTo(profile.drivingLicense)}</h4></td>
                    </tr>
                    <tr>
                        <td colSpan={2}><h4>{mailTo(profile.email)}</h4></td>
                        <td><h4>{callTo(profile.phone)}</h4></td>
                        <td><h4>{linkTo(profile.address)}</h4></td>
                    </tr>
                    <tr>
                        <td colSpan={2}><h3>{linkTo(profile.linkedIn)}</h3></td>
                        <td><h4>{linkTo(profile.gitHub)}</h4></td>
                        <td><h4>{linkTo(profile.blog)}</h4></td>
                    </tr>
                    <tr>
                        <td><h4>{addIconTo(profile.english)}</h4></td>
                        <td><h4>{linkTo(profile.dutch)}</h4></td>
                        <td><h4>{linkTo(profile.german)}</h4></td>
                        <td><h4>{addIconTo(profile.bulgarian)}</h4></td>
                    </tr>
                </tbody>
            </Table>
        </header>
    );
};

export default Header;