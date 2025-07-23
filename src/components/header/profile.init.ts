import { Profile } from "./profile";
import enProfile from "./profile.en.json";
import nlProfile from "./profile.nl.json";

export function getProfile(lang: 'en' | 'nl'): Profile {
    return lang === 'nl' ? (nlProfile as Profile) : (enProfile as Profile);
}

export default getProfile;