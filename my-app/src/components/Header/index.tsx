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
                        <td colSpan={colSpan(profile)}><h1>{profile.name}</h1></td>
                        <td><h5>{linkTo(profile.birthday)}</h5></td>
                        <td><h5>{linkTo(profile.drivingLicense)}</h5></td>
                    </tr>
                    <tr>
                        <td colSpan={colSpan(profile)}><h5>{mailTo(profile.email)}</h5></td>
                        <td><h5>{callTo(profile.phone)}</h5></td>
                        <td><h5>{linkTo(profile.address)}</h5></td>
                    </tr>
                    <tr>
                        <td colSpan={colSpan(profile)}><h5>{linkTo(profile.linkedIn)}</h5></td>
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

