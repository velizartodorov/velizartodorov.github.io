import { Link } from "./Link";

export class Profile {
    name = 'Velizar Todorov';
    imageUrl = '/profile/velizar.jpg';
    imageSize = 200;
    email = 'veltodorov@outlook.com';
    phone = new Link('+32487371027', '/phone.png', 45, '');
    birthday = new Link('25 July, 1994', '/cake.png', 45, '');
    address = new Link('Gent, Belgium', '/house.png', 45, 'https://en.wikipedia.org/wiki/Ghent');
    drivingLicense = new Link('Driving license type B', '/driving_license.png', 45, '');
    linkedIn = new Link('LinkedIn', '/linkedin.png', 40, 'https://www.linkedin.com/in/veltodorov/');
    gitHub = new Link('velizartodorov', '/github.png', 40, 'https://github.com/velizartodorov/');
    blog = new Link('Personal blog', '/blog.png', 47, 'https://willscornersite.wordpress.com/');
    english = new Link('English (B2/C1)', '/speak.png', 47, '');
    dutch = new Link('Dutch (B2)', '/speak.png', 47, 'https://drive.google.com/file/d/1qYLbhdFkVua9-topA3Mqx25HuCwhvmys/view?usp=sharing');
    bulgarian = new Link('Bulgarian (Mother tongue)', '/speak.png', 47, '');
};

export default Profile;