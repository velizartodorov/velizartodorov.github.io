import Table from 'react-bootstrap/Table';
import { profile } from './profile.init';
import './header.css';
import * as utils from './utils';

const Header = () => {
    utils.useDocumentTitle(profile.name);
    return (
        <header className="header">
            <Table responsive borderless>
                <tbody>
                    <tr>
                        <td rowSpan={4}>{utils.profilePicture(profile)}</td>
                        <td><h2>{profile.name}</h2></td>
                        <td> {utils.linkTo(profile.birthday)}</td>
                        <td> {utils.linkTo(profile.drivingLicense)}</td>
                    </tr>
                    <tr>
                        <td>{utils.mailTo(profile.email)}</td>
                        <td>{utils.callTo(profile.phone)}</td>
                        <td>{utils.linkTo(profile.address)}</td>
                    </tr>
                    <tr>
                        <td>{utils.linkTo(profile.linkedIn)}</td>
                        <td>{utils.linkTo(profile.gitHub)}</td>
                        <td>{utils.linkTo(profile.blog)}</td>
                    </tr>
                    <tr>
                        {profile.languages.map((language) => (
                            <td key={language.name}>
                                {utils.linkTo(language)}
                            </td>
                        ))}
                    </tr>
                </tbody>
            </Table>
        </header>
    );
};

export default Header;

