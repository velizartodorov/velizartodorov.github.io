import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const BASE_BTN = [
    'rounded-[20px] border-none px-[13px] py-[5px] font-sans text-[13px] font-semibold leading-[1.4]',
    'tracking-[0.5px] transition-colors duration-300 ease-out cursor-pointer',
    'focus-visible:outline focus-visible:outline-2 focus-visible:outline-app-accent focus-visible:outline-offset-1',
].join(' ');
const ACTIVE_BTN = 'bg-app-accent-subtle text-app-accent';
const INACTIVE_BTN = 'bg-transparent text-app-text-muted hover:text-app-text';

export const LanguageSelector: React.FC = () => {
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const isEnglish = pathname !== '/nl' && !pathname.startsWith('/nl/');

    const switchTo = (lang: 'en' | 'nl') => {
        navigate(lang === 'nl' ? '/nl' : '/', { replace: true });
    };

    return (
        <div
            className="border-app-border bg-app-surface-alt inline-flex items-center gap-0.5 rounded-3xl border p-[3px]"
            role="group"
            aria-label="Language"
        >
            <button
                type="button"
                className={`${BASE_BTN} ${isEnglish ? ACTIVE_BTN : INACTIVE_BTN}`}
                onClick={() => switchTo('en')}
                aria-pressed={isEnglish}
            >
                EN
            </button>
            <button
                type="button"
                className={`${BASE_BTN} ${!isEnglish ? ACTIVE_BTN : INACTIVE_BTN}`}
                onClick={() => switchTo('nl')}
                aria-pressed={!isEnglish}
            >
                NL
            </button>
        </div>
    );
};
