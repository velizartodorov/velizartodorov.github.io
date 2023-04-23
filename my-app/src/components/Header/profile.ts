import { Link } from "./link";
import { profile } from "./profile.init";

export interface IProfile {
  name: string;
  imageUrl: string;
  imageSize: number;
  email: string;
  phone: Link;
  birthday: Link;
  address: Link;
  drivingLicense: Link;
  linkedIn: Link;
  gitHub: Link;
  blog: Link;
  english: Link;
  dutch: Link;
  german: Link;
  bulgarian: Link;
}

export default profile;