export class Profile {
    name = 'Velizar Todorov';
    imageUrl = '/velizar.jpg';
    imageSize = 200;
    email = 'veltodorov@outlook.com';
    phone = '+32487371027';
    birthday = '25 July, 1994';
    residence = new Link('Gent, Belgium', '/house.png', 45, 'https://en.wikipedia.org/wiki/Ghent');
    drivingLicense = new Link('Driving license type B', '/driving_license.png', 45, '');
    linkedIn = new Link('LinkedIn', '/linkedin.png', 40,  'https://www.linkedin.com/in/veltodorov/');
    gitHub = new Link('velizartodorov', '/github.png', 40, 'https://github.com/velizartodorov/');
    blog = new Link('Personal blog', '/blog.png', 47, 'https://willscornersite.wordpress.com/');
    english = 'English (B2/C1)';
    dutch = 'Dutch (B2)';
    bulgarian = 'Bulgarian (Mother tongue)';
};

export class Link {
    name: string;
    icon: string;
    iconSize: number;
    url: string;

    constructor(name: string, icon: string,  iconSize: number, url: string) {
        this.name = name;
        this.icon = icon;
        this.iconSize = iconSize;
        this.url = url;
    }
}

export default Profile;