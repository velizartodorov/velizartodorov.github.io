
const monthsEN = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

const monthsNL = [
    'januari', 'februari', 'maart', 'april', 'mei', 'juni',
    'juli', 'augustus', 'september', 'oktober', 'november', 'december'
];

export const HASSELT_REMOTE = 'Hasselt, Belgium (Remote)';
export const GHENT_CONTRACT = 'Ghent, Belgium (Contract)';
export const GHENT = 'Ghent, Belgium';
export const RUSE = 'Rousse, Bulgaria';
export const UNIVERSITY_RUSE = 'University of Rousse';
export const VELIKO_TARNOVO = 'Veliko Tarnovo, Bulgaria';
export const ELENA = 'Elena, Bulgaria';

export const SERVICE = 'Service';
export const PRODUCT = 'Product';
export const CONSULTANCY = 'Consultancy';

export function bullet(): string {
    return '\u2022';
}

export function currentDate(): Date {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

export function monthYear(date: Date, lang: 'en' | 'nl' = 'en'): string {
    const month = date.getMonth();
    const year = date.getFullYear();
    const months = lang === 'nl' ? monthsNL : monthsEN;
    return `${months[month]} ${year}`;
}

export function getImageUrl(imageUrl: string) {
    return process.env.PUBLIC_URL + imageUrl;
}