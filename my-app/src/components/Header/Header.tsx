
import { useEffect } from 'react';
import Table from 'react-bootstrap/Table';
import './Header.css';
import Profile from './Profile';

const profile = new Profile();

const Header = () => {
    setDocumentTitle();
    return getContent();
}

function getContent() {
    return <header className="header">
        <Table responsive borderless>
            <thead></thead>
            <tbody>
                <tr>
                    <td rowSpan={4}><ProfilePicture /></td>
                    <td><h1>{profile.name}</h1></td>
                    <td><h2>{profile.birthday}</h2></td>
                    <td><h2>{profile.drivingLicense}</h2></td>
                </tr>
                <tr>
                    <td><h2>{profile.email}</h2></td>
                    <td><h2>{profile.phone}</h2></td>
                    <td><h2>{profile.residense}</h2></td>
                </tr>
                <tr>
                    <td><h2>{profile.linkedIn}</h2></td>
                    <td><h2>{profile.gitHub}</h2></td>
                    <td><h2>{profile.blog}</h2></td>
                </tr>
                <tr>
                    <td><h2>{profile.english}</h2></td>
                    <td><h2>{profile.dutch}</h2></td>
                    <td><h2>{profile.bulgarian}</h2></td>
                </tr>
            </tbody>
        </Table>
    </header>;
}

function setDocumentTitle() {
    useEffect(() => {
        document.title = profile.name
    }, []);
}

function ProfilePicture() {
    return <img
        className="avatar"
        src={profile.imageUrl}
        alt={'Photo of ' + profile.name}
        style={{
            width: profile.imageSize,
        }}></img>
}

export default Header;