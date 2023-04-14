interface IEmployment {
    name: string;
    place: string;
    icon: string;
    period: string;
    body: string;
}

export const employments: IEmployment[] = [
    {
        name: 'Software Developer at Unified Post',
        place: 'Gent, Belgium',
        icon: '/employments/unified_post.png',
        period: 'April 2019 - February 2023',
        body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
    },
    {
        name: 'Java Developer at ADM Solutions',
        place: 'Gent, Belgium',
        icon: '/employments/adm_solutions.jpg',
        period: 'November 2018 - March 2019',
        body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
    },
    {
        name: 'Full-Stack Developer at DSI Ltd.',
        place: 'Rousse, Bulgaria',
        icon: '/employments/dsi-ltd-bulgaria.png',
        period: 'July 2017 - May 2018',
        body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
    }
]

export default IEmployment;