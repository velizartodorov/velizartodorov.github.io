import { Link } from "./link";

export interface Profile {
  name: string;
  imageUrl: string;
  imageSize: number;
  email: Link;
  address: Link;
  drivingLicense: Link;
  linkedIn: Link;
  gitHub: Link;
  blog: Link;
  languages: Array<Link>;
}