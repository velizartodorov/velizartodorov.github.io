import Table from 'react-bootstrap/Table';
import './style.css';
import { telLink, linkTo, mailtoLink, profilePicture, iconWithText, useDocumentTitle } from './utils';
import { profile } from './profile.init';

const Header = () => {
    useDocumentTitle(profile.name);
    return (
        <header className="header">
            <Table responsive borderless>
                <tbody>
                    <tr>
                        <td rowSpan={4}>{profilePicture(profile)}</td>
                        <td colSpan={2}><h1>{profile.name}</h1></td>
                        <td><h5>{iconWithText(profile.birthday)}</h5></td>
                        <td><h5>{iconWithText(profile.drivingLicense)}</h5></td>
                    </tr>
                    <tr>
                        <td colSpan={2}><h5>{mailtoLink(profile.email)}</h5></td>
                        <td><h5>{telLink(profile.phone)}</h5></td>
                        <td><h5>{linkTo(profile.address)}</h5></td>
                    </tr>
                    <tr>
                        <td colSpan={2}><h5>{linkTo(profile.linkedIn)}</h5></td>
                        <td><h5>{linkTo(profile.gitHub)}</h5></td>
                        <td><h5>{linkTo(profile.blog)}</h5></td>
                    </tr>
                    <tr>
                        <td><h5>{iconWithText(profile.english)}</h5></td>
                        <td><h5>{linkTo(profile.dutch)}</h5></td>
                        <td><h5>{linkTo(profile.german)}</h5></td>
                        <td><h5>{iconWithText(profile.bulgarian)}</h5></td>
                    </tr>
                </tbody>
            </Table>
        </header>
    );
};

export default Header;