'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { I18nextProvider } from 'react-i18next';
import Education from '../components/education/education';
import Employments from '../components/employments/employments';
import Footer from '../components/footer/footer';
import Header from '../components/header/header';
import Nav from '../components/nav/nav';
import Presentations from '../components/presentations/presentations';
import Languages from '../components/languages/languages';
import Introduction from '../components/introduction/introduction';
import LicensesCertifications from '../components/licenses_certifications/licenses_certifications';
import { TimelineActiveProvider } from '../components/common/timeline_active';
import EnvBanner from './env_banner';
import { sectionFromPathname, sectionPath, type SectionSlug } from './sections';
import { createLangInstance, loadLanguage, otherLanguages, type Language } from './translations/i18n';
import { LangSwitchContext, useLangSwitch } from './translations/lang-switch-context';
import type { ActiveSection } from '../components/nav/use_active_section';

function PageContent({ lang }: Readonly<{ lang: Language }>) {
    const ref = useRef<HTMLDivElement>(null);
    const isFirstRender = useRef(true);

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }
        const el = ref.current;
        if (!el) return;
        el.classList.remove('fade-in-text');
        el.getBoundingClientRect();
        el.classList.add('fade-in-text');
    }, [lang]);

    return (
        <div ref={ref} className="fade-in-text">
            <TimelineActiveProvider>
                <Introduction className="mx-6" id={'introduction' satisfies ActiveSection} />
                <Employments className="mx-6" id={'employments' satisfies ActiveSection} />
                <LicensesCertifications className="mx-6" id={'certifications' satisfies ActiveSection} />
                <Presentations className="mx-6" id={'presentations' satisfies ActiveSection} />
                <Languages className="mx-6" id={'languages' satisfies ActiveSection} />
                <Education className="mx-6" id={'education' satisfies ActiveSection} />
            </TimelineActiveProvider>
        </div>
    );
}

function PortfolioAppInner({ initialSection }: Readonly<{ initialSection?: SectionSlug }>) {
    const { lang, switchTo } = useLangSwitch();

    useEffect(() => {
        document.documentElement.lang = lang;
    }, [lang]);

    useEffect(() => {
        if (!initialSection) return;
        document.getElementById(initialSection)?.scrollIntoView({ block: 'start' });
    }, [initialSection]);

    useEffect(() => {
        const onPopState = () => {
            const slug = sectionFromPathname(globalThis.location.pathname);
            const el = slug ? document.getElementById(slug) : document.getElementById('introduction');
            el?.scrollIntoView({ block: 'start' });
        };
        globalThis.addEventListener('popstate', onPopState);
        return () => globalThis.removeEventListener('popstate', onPopState);
    }, []);

    useEffect(() => {
        const search = globalThis.location.search;
        if (!search) return;
        const langParam = new URLSearchParams(search).get('lang');
        if (langParam === 'nl' || langParam === 'en') {
            switchTo(langParam);
        }
    }, []);

    return (
        <>
            <EnvBanner />
            <Header />
            <Nav initialSection={initialSection} />
            <PageContent lang={lang} />
            <Footer />
        </>
    );
}

interface PortfolioAppProps {
    initialLang: Language;
    initialResources: Parameters<typeof createLangInstance>[1];
    initialSection?: SectionSlug;
}

export function PortfolioApp({ initialLang, initialResources, initialSection }: Readonly<PortfolioAppProps>) {
    const [instance] = useState(() => createLangInstance(initialLang, initialResources));
    const [lang, setLang] = useState<Language>(initialLang);
    const targetLangRef = useRef<Language>(initialLang);
    const latestSwitchRef = useRef(0);

    useEffect(() => {
        for (const other of otherLanguages(initialLang)) {
            loadLanguage(instance, other).catch((error: unknown) => {
                console.error(`Failed to prefetch language "${other}":`, error);
            });
        }
    }, []);

    const switchTo = useCallback(
        async (next: Language) => {
            if (next === targetLangRef.current) return;
            const previousTarget = targetLangRef.current;
            targetLangRef.current = next;
            const requestId = ++latestSwitchRef.current;

            try {
                await loadLanguage(instance, next);
                await instance.changeLanguage(next);
            } catch (error) {
                console.error(`Failed to switch language to "${next}":`, error);
                if (latestSwitchRef.current === requestId) {
                    targetLangRef.current = previousTarget;
                }
                return;
            }

            if (latestSwitchRef.current !== requestId) return;

            setLang(next);
            globalThis.history.replaceState(
                null,
                '',
                sectionPath(next, sectionFromPathname(globalThis.location.pathname)),
            );
        },
        [instance],
    );

    const langSwitchValue = useMemo(() => ({ lang, switchTo }), [lang, switchTo]);

    return (
        <I18nextProvider i18n={instance}>
            <LangSwitchContext.Provider value={langSwitchValue}>
                <PortfolioAppInner initialSection={initialSection} />
            </LangSwitchContext.Provider>
        </I18nextProvider>
    );
}
