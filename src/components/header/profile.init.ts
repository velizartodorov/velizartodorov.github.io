import { GHENT } from "../common/utils";
import { Profile } from "./profile";

export const profile: Profile = {
    name: 'Velizar Todorov',
    imageUrl: '/header/velizar.png',
    email: {
        label: 'veltodorov@outlook.com',
        url: "mailto:veltodorov@outlook.com",
        icon: "/header/mail.png",
        width: 40
    },
    address: {
        label: GHENT,
        icon: '/header/house.png',
        width: 45,
        url: 'https://maps.app.goo.gl/Lz9CWt9u64AkSTE97',
    },
    drivingLicense: {
        label: 'Driving license type B',
        icon: '/header/driving_license.png',
        width: 60,
    },
    linkedIn: {
        label: 'LinkedIn',
        icon: '/header/linkedin.png',
        width: 40,
        url: 'https://www.linkedin.com/in/veltodorov/',
    },
    gitHub: {
        label: 'velizartodorov',
        icon: '/header/github.png',
        width: 40,
        url: 'https://github.com/velizartodorov/',
    },
    blog: {
        label: 'Personal blog',
        icon: '/header/blog.png',
        width: 47,
        url: 'https://willscornersite.wordpress.com/',
    },
    languages: [
        {
            label: 'English',
            icon: '/header/speak.png',
            width: 47,
        },
        {
            label: 'Dutch',
            icon: '/header/speak.png',
            width: 47,
        },
        {
            label: 'Bulgarian (Native)',
            icon: '/header/speak.png',
            width: 47,
        },
    ]
};