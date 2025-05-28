import { LicenseCertification } from "./license_certification";

export const licensesCertifications: LicenseCertification[] = [
    {
        icon: '/education/udemy_icon.svg',
        name: 'AWS Essentials',
        institution: 'Udemy',
        field: 'AWS',
        date: new Date(2025, 1),
        link: '/certificates/AWS-Essentials-Velizar-Todrov.pdf'
    },
    {
        icon: '/education/cvo_gent.png',
        name: 'Nederlands - tweede taal - richtgraad 2',
        institution: 'Het Perspectief PCVO',
        field: 'Dutch/Flemish Language and Literature',
        date: new Date(2021, 4)
    },
    {
        icon: '/education/naric.svg',
        name: 'Opleidingskwalifikatiegraad - Masters',
        institution: 'NARIC-Vlaanderen',
        field: 'Dutch/Flemish Language and Literature',
        date: new Date(2018, 6)
    },
    {
        icon: '/education/deutsches-sprachdiplom.jpg',
        name: 'Deutsches Sprachdiplom (DSD)',
        institution: 'Kulturministerkonferenz Deutschland',
        field: 'German Language and Literature',
        date: new Date(2012, 11)
    }
]