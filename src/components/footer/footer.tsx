import { currentYear } from './utils';
import { profile } from './../header/profile.init';
import './footer.css';

const Footer = () => (
  <div className="text-center mt-2 mb-2 footer-font">
    Powered by {profile.name} ® {currentYear()} 😉🚀
  </div>
);

export default Footer;