import { GHENT } from "../../common/utils";
import { IEducation } from "../education.init";

export const dutch: IEducation = {
    occupation: "Dutch second language",
    institution: 'Het Perspectief PCVO',
    place: GHENT,
    icon: '/education/cvo_gent.png',
    period: {
        start: new Date(2019, 0),
        end: new Date(2021, 4)
    },
    body: [
        `References 📌`,
        ``
    ],
    references: [
        { value: "Dutch second language - Level 2 (B2) information", href: "https://www.vlaanderen.be/opleidingsdatabank/nederlands-tweede-taal-richtgraad-2" }
    ]
}