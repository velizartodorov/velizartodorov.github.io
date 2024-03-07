import Table from 'react-bootstrap/Table';
import { profile } from './profile.init';
import './header.css';
import { useDocumentTitle, profilePicture, linkTo, mailTo, callTo } from './utils';

const Header = () => {
    useDocumentTitle(profile.name);
    return (
        <header className="header">
            <Table responsive borderless>
                <tbody>
                    <tr>
                        <td rowSpan={4}>{profilePicture(profile)}</td>
                        <td><h2>{profile.name}</h2></td>
                        <td> {linkTo(profile.birthday)}</td>
                        <td> {linkTo(profile.drivingLicense)}</td>
                    </tr>
                    <tr>
                        <td>{mailTo(profile.email)}</td>
                        <td>{callTo(profile.phone)}</td>
                        <td>{linkTo(profile.address)}</td>
                    </tr>
                    <tr>
                        <td>{linkTo(profile.linkedIn)}</td>
                        <td>{linkTo(profile.gitHub)}</td>
                        <td>{linkTo(profile.blog)}</td>
                    </tr>
                    <tr>
                        {profile.languages.map((language) => (
                            <td key={language.name}>
                                {linkTo(language)}
                            </td>
                        ))}
                    </tr>
                </tbody>
            </Table>
        </header>
    );
};

export default Header;

