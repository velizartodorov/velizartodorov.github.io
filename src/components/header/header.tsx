import ThemeToggle from './theme_toggle';
import { useProfile } from '../profile/profile.init';
import { LanguageSelector } from '../../app/translations/language_selector';
import ProfileItem from '../profile/profile_item';
import Image from 'next/image';
import React from 'react';

const Header: React.FC<{ minimalMode?: boolean }> = ({ minimalMode = false }) => {
    const profile = useProfile();

    const photo = (
        <Image
            className="border-app-surface-alt size-[200px] rounded-full border-[3px] object-cover shadow-[0_4px_16px_var(--app-shadow)] transition-[scale,box-shadow] duration-500 ease-out hover:scale-[1.01] hover:shadow-[0_6px_24px_var(--app-shadow)]"
            src={profile.imageUrl}
            alt=""
            width={200}
            height={200}
            priority
        />
    );

    const nameHeading = <h2 className="m-0 text-[2rem] font-bold tracking-tight">{profile.name}</h2>;

    if (minimalMode) {
        return (
            <header>
                <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
                    {photo}
                    <div className="flex w-full flex-col items-center gap-2 sm:w-auto sm:items-start">
                        <div className="flex items-center gap-4">
                            {nameHeading}
                            <ThemeToggle />
                        </div>
                        <div className="flex w-fit flex-col items-start gap-y-2">
                            <ProfileItem link={profile.email} />
                            <ProfileItem link={profile.gitHub} />
                            <ProfileItem link={profile.blog} />
                        </div>
                    </div>
                </div>
            </header>
        );
    }

    return (
        <header className="mt-3 ml-0 md:ml-6">
            <div className="mb-2 grid grid-cols-1 items-center justify-items-center gap-x-4 gap-y-2 text-center lg:grid-cols-[240px_repeat(3,1fr)] lg:justify-items-start lg:text-left">
                <div className="row-start-1 lg:col-start-1 lg:row-span-3">{photo}</div>
                <div className="row-start-2 flex items-center gap-4 lg:col-span-3 lg:col-start-2 lg:row-start-1">
                    {nameHeading}
                    <ThemeToggle />
                </div>
                <div className="lg:col-start-2 lg:row-start-2">
                    <LanguageSelector />
                </div>
                <div className="flex w-fit flex-col items-start gap-y-2 lg:contents">
                    <div className="lg:col-start-3 lg:row-start-2">
                        <ProfileItem link={profile.email} />
                    </div>
                    <div className="lg:col-start-4 lg:row-start-2">
                        <ProfileItem link={profile.linkedIn} />
                    </div>
                    <div className="lg:col-start-2 lg:row-start-3">
                        <ProfileItem link={profile.gitHub} />
                    </div>
                    <div className="lg:col-start-3 lg:row-start-3">
                        <ProfileItem link={profile.blog} />
                    </div>
                    <div className="lg:col-start-4 lg:row-start-3">
                        <ProfileItem link={profile.address} />
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
