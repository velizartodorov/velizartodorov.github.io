'use client';

import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { I18nextProvider } from 'react-i18next';
import Education from './components/education/education';
import Employments from './components/employments/employments';
import Footer from './components/footer/footer';
import Header from './components/header/header';
import Presentations from './components/presentations/presentations';
import Languages from './components/languages/languages';
import Introduction from './components/introduction/introduction';
import LicensesCertifications from './components/licenses_certifications/licenses_certifications';
import EnvBanner from './components/common/env_banner';
import { createLangInstance, loadLanguage, type Language } from './i18n';
import reportWebVitals from './reportWebVitals';

interface LangSwitchValue {
    lang: Language;
    switchTo: (lang: Language) => Promise<void>;
}

const LangSwitchContext = createContext<LangSwitchValue | null>(null);

export function useLangSwitch(): LangSwitchValue {
    const ctx = useContext(LangSwitchContext);
    if (!ctx) throw new Error('useLangSwitch must be used within PortfolioApp');
    return ctx;
}

function PageContent({ lang }: { lang: Language }) {
    const ref = useRef<HTMLDivElement>(null);
    const isFirstRender = useRef(true);

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }
        const el = ref.current;
        if (!el) return;
        // Replay the fade-in on every language switch without remounting
        // (remounting would reset accordion open/closed state).
        el.classList.remove('fade-in-text');
        void el.offsetWidth;
        el.classList.add('fade-in-text');
    }, [lang]);

    return (
        <div ref={ref} className="fade-in-text">
            <Introduction className="mx-6" eventKey="0" />
            <Employments className="mx-6 mt-4" eventKey="1" />
            <LicensesCertifications className="mx-6 mt-4" eventKey="2" />
            <Presentations className="mx-6 mt-4" eventKey="3" />
            <Languages className="mx-6 mt-4" eventKey="4" />
            <Education className="mx-6 mt-4" eventKey="5" />
        </div>
    );
}

function PortfolioAppInner() {
    const { lang, switchTo } = useLangSwitch();

    useEffect(() => {
        document.documentElement.lang = lang;
    }, [lang]);

    useEffect(() => {
        reportWebVitals();
    }, []);

    useEffect(() => {
        // Backward compat: ?lang=nl / ?lang=en links redirect to the /nl subpath.
        const search = globalThis.location.search;
        if (!search) return;
        const langParam = new URLSearchParams(search).get('lang');
        if (langParam === 'nl' || langParam === 'en') {
            switchTo(langParam);
        }
        // Intentionally mount-only: switchTo/instance/setLang are all referentially
        // stable across renders even though the closure identity changes.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            <EnvBanner />
            <Header />
            <PageContent lang={lang} />
            <Footer />
        </>
    );
}

interface PortfolioAppProps {
    initialLang: Language;
    // The initial language's translation data, computed at build time by the (server-rendered)
    // page component. Keeping this per-page rather than importing both languages here is what
    // keeps the other language's (larger) translation payload out of this page's JS bundle.
    initialResources: Parameters<typeof createLangInstance>[1];
}

export function PortfolioApp({ initialLang, initialResources }: PortfolioAppProps) {
    const [instance] = useState(() => createLangInstance(initialLang, initialResources));
    const [lang, setLang] = useState<Language>(initialLang);

    const switchTo = async (next: Language) => {
        await loadLanguage(instance, next);
        await instance.changeLanguage(next);
        setLang(next);
        globalThis.history.replaceState(null, '', next === 'nl' ? '/nl/' : '/');
    };

    return (
        <I18nextProvider i18n={instance}>
            <LangSwitchContext.Provider value={{ lang, switchTo }}>
                <PortfolioAppInner />
            </LangSwitchContext.Provider>
        </I18nextProvider>
    );
}
