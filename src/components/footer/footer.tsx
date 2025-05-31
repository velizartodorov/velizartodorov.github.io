import { profile } from './../header/profile.init';
import './footer.css';
import { useCurrentYear } from './utils';

const Footer = () => {
  const { year } = useCurrentYear();
  return (
    <div className="text-center mt-2 mb-2 footer-font">
      Powered by {profile.name} ® {year ?? ''} 😉 🚀
    </div>
  );
};

export default Footer;