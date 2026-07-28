import { sectionMetadata, sectionPage } from '../../section_page';

export { generateStaticParams } from '../../section_page';

export const dynamicParams = false;

export const generateMetadata = sectionMetadata('nl');

export default sectionPage('nl');
