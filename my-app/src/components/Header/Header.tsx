
import { useEffect } from 'react';
import Table from 'react-bootstrap/Table';
import './Header.css';
import Profile from './Profile';
import { Envelope } from 'react-bootstrap-icons';

const profile = new Profile();

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
                    <td rowSpan={4}><ProfilePicture /></td>
                    <td><h1>{profile.name}</h1></td>
                    <td><h2>{profile.birthday}</h2></td>
                    <td><h2>{profile.drivingLicense}</h2></td>
                </tr>
                <tr>
                    <td><h2>{mailTo(profile.email)}</h2></td>
                    <td><h2>{profile.phone}</h2></td>
                    <td><h2>{profile.residense}</h2></td>
                </tr>
                <tr>
                    <td><h2><LinkedIn /></h2></td>
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

function mailTo(mail: string) {
    return <a className="no-underline"
        href={"mailto:" + mail}>
        <a ><Envelope color="royalblue" size={40} /> </a>
        <a className='envelope-margin no-underline'>{mail}</a>
    </a>;
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

function LinkedIn() {
    return <a className="no-underline" 
        href={profile.linkedInLink}
        target="_blank">
       <a> <img  
        src={profile.linkedInIcon}
        style={{
            width: 40
        }}></img></a>
        <a className="envelope-margin no-underline"> {profile.linkedIn}</a>
        </a>
}

export default Header;