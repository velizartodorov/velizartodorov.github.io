import {  LicenseCertification } from "./license_certification";

export const licensesCertifications: LicenseCertification[] = [
    {
        icon: 'portfolio/education/cvo_gent.png',
        name: 'Nederlands - tweede taal - richtgraad 2',
        institution: 'Het Perspectief PCVO',
        field: 'Dutch/Flemish Language and Literature',
        link: 'nederlands.pdf',
        date: new Date(2020, 6)
    },
    {
        icon: 'education/naric.svg',
        name: 'Opleidingskwalifikatiegraad - Masters',
        institution: 'NARIC-Vlaanderen',
        field: 'Dutch/Flemish Language and Literature',
        link: 'opleidingskwalifikatiegraad - masters.pdf',
        date: new Date(2018, 6)
    },
    {
        icon: 'education/deutsches-sprachdiplom.jpg',
        name: 'Deutsches Sprachdiplom (DSD)',
        institution: 'Kulturministerkonferenz Deutschland',
        field: 'German Language and Literature',
        link: 'deutsch.pdf',
        date: new Date(2012, 11)
    }
]