import { currentYear } from './utils';
import { profile } from './../header/profile.init';
const Footer = () => (
  <div className="text-center mt-3 mb-2">
    Powered by {profile.name} ® {currentYear()} 😉🚀
  </div>
);

export default Footer;