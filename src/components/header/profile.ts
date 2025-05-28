import { Link } from "./link";

export interface Profile {
  name: string;
  imageUrl: string;
  email: Link;
  address: Link;
  drivingLicense: Link;
  linkedIn: Link;
  gitHub: Link;
  blog: Link;
  languages: Array<Link>;
}