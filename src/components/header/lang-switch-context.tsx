'use client';

import { createContext, useContext } from 'react';
import type { Language } from '../../translations/i18n';

export interface LangSwitchValue {
    lang: Language;
    switchTo: (lang: Language) => Promise<void>;
}

export const LangSwitchContext = createContext<LangSwitchValue | null>(null);

export function useLangSwitch(): LangSwitchValue {
    const ctx = useContext(LangSwitchContext);
    if (!ctx) throw new Error('useLangSwitch must be used within PortfolioApp');
    return ctx;
}
