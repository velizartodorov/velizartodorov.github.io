import React from 'react';
import type { Language } from './languages';
import { useLangSwitch } from './lang-switch-context';

export const LANGUAGE_LABEL: Record<Language, string> = { en: 'EN', nl: 'NL' };

const BASE_BTN = `rounded-[20px] border-none px-[13px] py-[5px] font-sans text-[13px] leading-[1.4] font-semibold
    cursor-pointer tracking-[0.5px] transition-colors duration-75 ease-out
    focus-visible:outline-app-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1`;
const ACTIVE_BTN = 'bg-app-accent-subtle text-app-accent';
const INACTIVE_BTN = 'bg-transparent text-app-text-muted hover:text-app-text';

export const LanguageSelector: React.FC = () => {
    const { lang, switchTo } = useLangSwitch();
    const isEnglish = lang !== 'nl';

    return (
        <fieldset
            className="border-app-border bg-app-surface-alt inline-flex items-center gap-0.5 rounded-3xl border p-[3px]"
            aria-label="Language"
        >
            <button
                type="button"
                className={`${BASE_BTN} ${isEnglish ? ACTIVE_BTN : INACTIVE_BTN}`}
                onClick={() => switchTo('en')}
                aria-pressed={isEnglish}
            >
                {LANGUAGE_LABEL.en}
            </button>
            <button
                type="button"
                className={`${BASE_BTN} ${!isEnglish ? ACTIVE_BTN : INACTIVE_BTN}`}
                onClick={() => switchTo('nl')}
                aria-pressed={!isEnglish}
            >
                {LANGUAGE_LABEL.nl}
            </button>
        </fieldset>
    );
};
