import { GENT } from "../places";
import { Profile } from "./profile";

export const profile: Profile = {
    name: 'Velizar Todorov',
    imageUrl: '/header/velizar.png',
    imageSize: 220,
    email: 'veltodorov@outlook.com',
    phone: {
        name: '+32487371027',
        icon: '/header/phone.png',
        iconSize: 45,
        url: '',
    },
    birthday: {
        name: '25 July, 1994',
        icon: '/header/cake.png',
        iconSize: 45,
        url: '',
    },
    address: {
        name: GENT,
        icon: '/header/house.png',
        iconSize: 45,
        url: 'https://maps.app.goo.gl/Lz9CWt9u64AkSTE97',
    },
    drivingLicense: {
        name: 'Driving license type B',
        icon: '/header/driving_license.png',
        iconSize: 60,
        url: '',
    },
    linkedIn: {
        name: 'LinkedIn',
        icon: '/header/linkedin.png',
        iconSize: 40,
        url: 'https://www.linkedin.com/in/veltodorov/',
    },
    gitHub: {
        name: 'velizartodorov',
        icon: '/header/github.png',
        iconSize: 40,
        url: 'https://github.com/velizartodorov/',
    },
    blog: {
        name: 'Personal blog',
        icon: '/header/blog.png',
        iconSize: 47,
        url: 'https://willscornersite.wordpress.com/',
    },
    languages: [
        {
            name: 'English',
            icon: '/header/speak.png',
            iconSize: 47,
            url: '',
        },
        {
            name: 'Dutch',
            icon: '/header/speak.png',
            iconSize: 47,
            url: '/certificates/nederlands.pdf',
        },
        {
            name: 'Bulgarian (Mother tongue)',
            icon: '/header/speak.png',
            iconSize: 47,
            url: '',
        },
    ]
};