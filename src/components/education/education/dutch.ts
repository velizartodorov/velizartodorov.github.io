import { GHENT } from "../../common/utils";
import { IEducation } from "../education.init";

export const dutch: IEducation = {
    occupation: "Dutch/Flemmish Language & Literature",
    institution: 'Het Perspectief PCVO',
    place: GHENT,
    icon: '/education/cvo_gent.png',
    period: {
        start: new Date(2019, 0),
        end: new Date(2020, 6)
    },
    body: [
        `References 📌`,
    ],
    references: [
        { value: "Educational certificate - Dutch second language - Level 2 (B2)", href: "/licenses_certifications/nederlands.pdf" },
        { value: "Dutch second language - Level 2 (B2) information", href: "https://www.vlaanderen.be/opleidingsdatabank/nederlands-tweede-taal-richtgraad-2" }
    ]
}