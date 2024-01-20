import Table from 'react-bootstrap/Table';
import { profile } from './profile.init';
import './style.css';
import { callTo, getColSpan as colSpan, linkTo, mailTo, profilePicture, useDocumentTitle } from './utils';

const Header = () => {
    useDocumentTitle(profile.name);
    return (
        <header className="header">
            <Table responsive borderless>
                <tbody>
                    <tr>
                        <td rowSpan={profile.languages.length}>{profilePicture(profile)}</td>
                        <td colSpan={colSpan(profile)}><h3>{profile.name}</h3></td>
                        <td><h6>{linkTo(profile.birthday)}</h6></td>
                        <td><h6>{linkTo(profile.drivingLicense)}</h6></td>
                    </tr>
                    <tr>
                        <td colSpan={colSpan(profile)}><h6>{mailTo(profile.email)}</h6></td>
                        <td><h6>{callTo(profile.phone)}</h6></td>
                        <td><h6>{linkTo(profile.address)}</h6></td>
                    </tr>
                    <tr>
                        <td colSpan={colSpan(profile)}><h6>{linkTo(profile.linkedIn)}</h6></td>
                        <td><h6>{linkTo(profile.gitHub)}</h6></td>
                        <td><h6>{linkTo(profile.blog)}</h6></td>
                    </tr>
                    <tr>
                        {profile.languages.map((language) => (
                            <td key={language.name}>
                                <h6>{linkTo(language)}</h6>
                            </td>
                        ))}
                    </tr>
                </tbody>
            </Table>
        </header>
    );
};

export default Header;

