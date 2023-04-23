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
                        <td><h5>{addIconTo(profile.birthday)}</h5></td>
                        <td><h5>{addIconTo(profile.drivingLicense)}</h5></td>
                    </tr>
                    <tr>
                        <td colSpan={2}><h5>{mailTo(profile.email)}</h5></td>
                        <td><h5>{callTo(profile.phone)}</h5></td>
                        <td><h5>{linkTo(profile.address)}</h5></td>
                    </tr>
                    <tr>
                        <td colSpan={2}><h5>{linkTo(profile.linkedIn)}</h5></td>
                        <td><h5>{linkTo(profile.gitHub)}</h5></td>
                        <td><h5>{linkTo(profile.blog)}</h5></td>
                    </tr>
                    <tr>
                        <td><h5>{addIconTo(profile.english)}</h5></td>
                        <td><h5>{linkTo(profile.dutch)}</h5></td>
                        <td><h5>{linkTo(profile.german)}</h5></td>
                        <td><h5>{addIconTo(profile.bulgarian)}</h5></td>
                    </tr>
                </tbody>
            </Table>
        </header>
    );
};

export default Header;