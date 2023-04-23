import Table from 'react-bootstrap/Table';
import { profile } from './profile.init';
import './style.css';
import { linkTo, mailtoLink, profilePicture, telLink, useDocumentTitle } from './utils';

const Header = () => {
    useDocumentTitle(profile.name);
    return (
        <header className="header">
            <Table responsive borderless>
                <tbody>
                    <tr>
                        <td rowSpan={4}>{profilePicture(profile)}</td>
                        <td colSpan={2}><h1>{profile.name}</h1></td>
                        <td><h5>{linkTo(profile.birthday)}</h5></td>
                        <td><h5>{linkTo(profile.drivingLicense)}</h5></td>
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
                        {profile.languages.map((language) => (
                            <td key={language.name}>
                                <h5>{linkTo(language)}</h5>
                            </td>
                        ))}
                    </tr>
                </tbody>
            </Table>
        </header>
    );
};

export default Header;