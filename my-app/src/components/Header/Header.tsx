
import { useEffect } from 'react';
import Table from 'react-bootstrap/Table';
import './Header.css';
import Profile from './Profile';
import { icon as addIconTo, callTo, linkTo, mailTo, profilePicture } from './Utils';
export const profile = new Profile();

const Header = () => {
    useEffect(() => {
        document.title = profile.name
    }, []);
    return getContent();
}

function getContent() {
    return <header className="header">
        <Table responsive borderless>
            <thead></thead>
            <tbody>
                <tr>
                    <td rowSpan={4}>{profilePicture(profile)}</td>
                    <td><h1>{profile.name}</h1></td>
                    <td><h2>{addIconTo(profile.birthday)}</h2></td>
                    <td><h2>{addIconTo(profile.drivingLicense)}</h2></td>
                </tr>
                <tr>
                    <td><h2>{mailTo(profile.email)}</h2></td>
                    <td><h2>{callTo(profile.phone)}</h2></td>
                    <td><h2>{linkTo(profile.residence)}</h2></td>
                </tr>
                <tr>
                    <td><h2>{linkTo(profile.linkedIn)}</h2></td>
                    <td><h2>{linkTo(profile.gitHub)}</h2></td>
                    <td><h2>{linkTo(profile.blog)}</h2></td>
                </tr>
                <tr>
                    <td><h2>{addIconTo(profile.english)}</h2></td>
                    <td><h2>{linkTo(profile.dutch)}</h2></td>
                    <td><h2>{addIconTo(profile.bulgarian)}</h2></td>
                </tr>
            </tbody>
        </Table>
    </header>;
}

export default Header;