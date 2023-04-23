import { GENT } from "../constants";
import { Period } from "./period";
import { IEmployment } from "./employment";

export const employments: IEmployment[] = [
    {
        position: "Java Software Crafter",
        company: 'Continuum',
        place: "Hybrid",
        icon: '/employments/continuum.jpg',
        period: new Period(new Date(2023, 5), new Date(2023, 5)),
        body: 'Joined the Continuum tribe, consulting clients using Java based applications.'
    },
    {
        position: "Software Developer",
        company: 'Unified Post',
        place: GENT,
        icon: '/employments/unified_post.png',
        period: new Period(new Date(2019, 4), new Date(2023, 2)),
        body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
    },
    {
        position: "Java Developer",
        company: 'ADM Solutions',
        place: GENT,
        icon: '/employments/adm_solutions.jpg',
        period: new Period(new Date(2018, 11), new Date(2019, 3)),
        body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
    },
    {
        position: "Erasmus+ C# Developer Trainee",
        company: 'ADM Solutions',
        place: GENT,
        icon: '/employments/adm_solutions.jpg',
        period: new Period(new Date(2018, 7), new Date(2018, 10)),
        body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
    },
    {
        position: "Full-Stack Developer",
        company: 'DSI Ltd.',
        place: 'Rousse, Bulgaria',
        icon: '/employments/dsi.png',
        period: new Period(new Date(2017, 7), new Date(2018, 5)),
        body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
    }
];