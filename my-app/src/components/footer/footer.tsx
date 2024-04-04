import { currentYear } from './utils';

const Footer = () => (
  <div className="text-center mt-2 mb-2">
    Powered by Velizar Todorov {currentYear()} ®
  </div>
);

export default Footer;