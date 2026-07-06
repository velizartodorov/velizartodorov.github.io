import { LanguageSelector } from '../common/language_selector';
import ThemeToggle from '../common/theme_toggle';
import { tw } from '../common/utils';
import { useProfile } from './profile.init';
import ProfileItem from './profile_item';
import React from 'react';

const Header: React.FC = () => {
    const profile = useProfile();
    return (
        <header className="mt-3 ml-0 md:ml-6">
            <div
                className={tw(
                    'mb-2 grid grid-cols-1 items-center justify-items-center gap-x-4 gap-y-2 text-center',
                    'sm:grid-cols-[240px_repeat(3,1fr)] sm:justify-items-start sm:text-left',
                )}
            >
                <img
                    className={tw(
                        'border-app-surface-alt row-start-1 h-[200px] w-[200px] rounded-full border-[3px] object-cover',
                        'shadow-[0_4px_16px_var(--app-shadow)] transition-[scale,box-shadow] duration-500 ease-out',
                        'hover:scale-[1.01] hover:shadow-[0_6px_24px_var(--app-shadow)] sm:col-start-1 sm:row-span-3',
                    )}
                    src={profile.imageUrl}
                    alt=""
                />
                <div className="row-start-2 flex items-center gap-4 sm:col-span-3 sm:col-start-2 sm:row-start-1">
                    <h2 className="m-0 text-[2rem] font-bold tracking-tight">{profile.name}</h2>
                    <ThemeToggle />
                </div>
                <div className="sm:col-start-2 sm:row-start-2">
                    <LanguageSelector />
                </div>
                <div className="flex w-fit flex-col items-start gap-y-2 sm:contents">
                    <div className="sm:col-start-3 sm:row-start-2">
                        <ProfileItem link={profile.email} />
                    </div>
                    <div className="sm:col-start-4 sm:row-start-2">
                        <ProfileItem link={profile.linkedIn} />
                    </div>
                    <div className="sm:col-start-2 sm:row-start-3">
                        <ProfileItem link={profile.gitHub} />
                    </div>
                    <div className="sm:col-start-3 sm:row-start-3">
                        <ProfileItem link={profile.blog} />
                    </div>
                    <div className="sm:col-start-4 sm:row-start-3">
                        <ProfileItem link={profile.address} />
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
