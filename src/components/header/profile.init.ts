import { GHENT } from "../common/utils";
import { Profile } from "./profile";

export const profile: Profile = {
    name: 'Velizar Todorov',
    imageUrl: 'header/velizar.png',
    imageSize: 220,
    email:{
        label: 'veltodorov@outlook.com',
        href: "mailto:veltodorov@outlook.com",
        url: "mailto:veltodorov@outlook.com",
        icon: "header/mail.png",
        width: 40
    },
    address: {
        label: GHENT,
        icon: 'portfolio/header/house.png',
        width: 45,
        href: 'https://maps.app.goo.gl/Lz9CWt9u64AkSTE97',
        url: 'https://maps.app.goo.gl/Lz9CWt9u64AkSTE97',
    },
    drivingLicense: {
        label: 'Driving license type B',
        icon: 'portfolio/header/driving_license.png',
        width: 60,
    },
    linkedIn: {
        label: 'LinkedIn',
        icon: 'portfolio/header/linkedin.png',
        width: 40,
        href: 'https://www.linkedin.com/in/veltodorov/',
        url: 'https://www.linkedin.com/in/veltodorov/',
    },
    gitHub: {
        label: 'velizartodorov',
        icon: 'portfolio/header/github.png',
        width: 40,
        href: 'https://github.com/velizartodorov/',
        url: 'https://github.com/velizartodorov/',
    },
    blog: {
        label: 'Personal blog',
        icon: 'portfolio/header/blog.png',
        width: 47,
        href: 'https://willscornersite.wordpress.com/',
        url: 'https://willscornersite.wordpress.com/',
    },
    languages: [
        {
            label: 'English',
            icon: 'portfolio/header/speak.png',
            width: 47,
        },
        {
            label: 'Dutch',
            icon: 'portfolio/header/speak.png',
            width: 47,
        },
        {
            label: 'Bulgarian (Native)',
            icon: 'portfolio/header/speak.png',
            width: 47,
        },
    ]
};