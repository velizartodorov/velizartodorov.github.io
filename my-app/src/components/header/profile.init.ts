import { GHENT } from "../common/utils";
import { Profile } from "./profile";

export const profile: Profile = {
    name: 'Velizar Todorov',
    imageUrl: '/header/velizar.png',
    imageSize: 220,
    email:{
        label: 'veltodorov@outlook.com',
        href: "mailto:veltodorov@outlook.com",
        url: "mailto:veltodorov@outlook.com",
        icon: "/header/mail.png",
        width: 40
    },
    phone: {
        label: '+32487371027',
        href: `tel:+32487371027`,
        url: `tel:+32487371027`,
        icon: '/header/phone.png',
        width: 45,
    },
    birthday: {
        label: '25 July, 1994',
        icon: '/header/cake.png',
        width: 45,
    },
    address: {
        label: GHENT,
        icon: '/header/house.png',
        width: 45,
        href: 'https://maps.app.goo.gl/Lz9CWt9u64AkSTE97',
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
        href: 'https://www.linkedin.com/in/veltodorov/',
        url: 'https://www.linkedin.com/in/veltodorov/',
    },
    gitHub: {
        label: 'velizartodorov',
        icon: '/header/github.png',
        width: 40,
        href: 'https://github.com/velizartodorov/',
        url: 'https://github.com/velizartodorov/',
    },
    blog: {
        label: 'Personal blog',
        icon: '/header/blog.png',
        width: 47,
        href: 'https://willscornersite.wordpress.com/',
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
            href: '/licenses_certifications/nederlands.pdf',
            url: '/licenses_certifications/nederlands.pdf',
        },
        {
            label: 'Bulgarian (Native)',
            icon: '/header/speak.png',
            width: 47,
        },
    ]
};