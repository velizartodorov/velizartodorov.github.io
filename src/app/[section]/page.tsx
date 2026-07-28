import { sectionMetadata, sectionPage } from '../section_page';

export { generateStaticParams } from '../section_page';

export const dynamicParams = false;

export const generateMetadata = sectionMetadata('en');

export default sectionPage('en');
