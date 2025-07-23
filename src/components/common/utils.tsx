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

export function getImageUrl(imageUrl: string) {
    return process.env.PUBLIC_URL + imageUrl;
}