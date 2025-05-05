import { Link } from "./link";

export interface Profile {
  name: string;
  imageUrl: string;
  imageSize: number;
  email: Link;
  phone: Link;
  birthday: Link;
  address: Link;
  drivingLicense: Link;
  linkedIn: Link;
  gitHub: Link;
  blog: Link;
  languages: Array<Link>;
}