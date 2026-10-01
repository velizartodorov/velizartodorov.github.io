import React from 'react';
import { isMinimalMode } from './feature_flags';
import type { Language } from './translations/languages';

export const REDIRECT_SCRIPT = `location.replace('/');`;

const REDIRECTING_TEXT: Record<Language, string> = {
    en: 'Redirecting…',
    nl: 'Omleiden…',
};

export function RedirectToRoot({ children, lang = 'en' }: Readonly<{ children?: React.ReactNode; lang?: Language }>) {
    return (
        <div className="mx-6 py-16 text-center">
            <script dangerouslySetInnerHTML={{ __html: REDIRECT_SCRIPT }} />
            {children ?? <p className="text-app-text-muted">{REDIRECTING_TEXT[lang]}</p>}
        </div>
    );
}

export function minimalModeRedirect(lang: Language = 'en') {
    return isMinimalMode() ? <RedirectToRoot lang={lang} /> : null;
}
