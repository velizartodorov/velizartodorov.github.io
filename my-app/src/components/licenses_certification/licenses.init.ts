import { ILicense } from "./license";

export const licenses: ILicense[] = [
    {
        icon: '/education/cvo_gent.png',
        name: 'Nederlands - tweede taal - richtgraad 2',
        institution: 'Het Perspectief PCVO',
        field: 'Dutch/Flemish Language and Literature',
        link: 'certificates/nederlands.pdf',
        date: new Date(2020, 6)
    },
    {
        icon: '/education/naric.svg',
        name: 'Opleidingskwalifikatiegraad - Masters',
        institution: 'NARIC-Vlaanderen',
        field: 'Dutch/Flemish Language and Literature',
        link: 'certificates/opleidingskwalifikatiegraad - masters.pdf',
        date: new Date(2018, 6)
    },
    {
        icon: '/education/deutsches-sprachdiplom.jpg',
        name: 'Deutsches Sprachdiplom (DSD)',
        institution: 'Kulturministerkonferenz Deutschland',
        field: 'German Language and Literature',
        link: 'certificates/deutsch.pdf',
        date: new Date(2012, 11)
    }
]