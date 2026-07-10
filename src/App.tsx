'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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
import { createLangInstance, loadLanguage, otherLanguages, type Language } from './translations/i18n';
import { LangSwitchContext, useLangSwitch } from './lang-switch-context';
import reportWebVitals from './reportWebVitals';

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
        // Replay the fade-in on every language switch without remounting
        // (remounting would reset accordion open/closed state).
        el.classList.remove('fade-in-text');
        el.getBoundingClientRect();
        el.classList.add('fade-in-text');
    }, [lang]);

    return (
        <div ref={ref} className="fade-in-text">
            <Introduction className="mx-6" eventKey="0" />
            <Employments className="mx-6 mt-2" eventKey="1" />
            <LicensesCertifications className="mx-6 mt-2" eventKey="2" />
            <Presentations className="mx-6 mt-2" eventKey="3" />
            <Languages className="mx-6 mt-2" eventKey="4" />
            <Education className="mx-6 mt-2" eventKey="5" />
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

export function PortfolioApp({ initialLang, initialResources }: Readonly<PortfolioAppProps>) {
    const [instance] = useState(() => createLangInstance(initialLang, initialResources));
    const [lang, setLang] = useState<Language>(initialLang);
    // The most recently REQUESTED language, updated synchronously on every call — distinct from
    // `lang` (the last CONFIRMED one), which only updates once a switch finishes. Comparing
    // against `lang` here would be stale while a switch is in flight: clicking EN to cancel a
    // still-pending switch to NL would wrongly no-op (lang is still 'en' at that point) and let
    // the stale NL switch win once it resolves. Comparing against this ref instead means each
    // new click always registers as the new target, so a later request can supersede an earlier
    // in-flight one.
    const targetLangRef = useRef<Language>(initialLang);
    const latestSwitchRef = useRef(0);

    useEffect(() => {
        // Warm the OTHER language's resources right after mount so that, by the time the visitor
        // clicks the toggle, `loadLanguage` below is a no-op and switching only costs a
        // `changeLanguage` + re-render — no network round trip in the critical path. This used to
        // wait for browser idle time, but idle time isn't guaranteed to arrive before a visitor
        // clicks (e.g. a fast click right after the page becomes interactive), which reintroduced
        // the network round trip for that click. The bundle is tiny (~9KB gzipped) and the fetch
        // is async, so firing it immediately doesn't compete with the initial page's own load.
        for (const other of otherLanguages(initialLang)) {
            loadLanguage(instance, other).catch((error: unknown) => {
                console.error(`Failed to prefetch language "${other}":`, error);
            });
        }
        // Mount-only: `instance` is referentially stable for the component's lifetime, and
        // `initialLang` never changes after the initial render.
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
                // Roll back so a retry of `next` isn't silently blocked by the early-return guard
                // above — but only if a newer switch hasn't already superseded this one, since that
                // newer request has already claimed `targetLangRef`.
                if (latestSwitchRef.current === requestId) {
                    targetLangRef.current = previousTarget;
                }
                return;
            }

            // A newer switch was requested while this one was in flight; let that one win instead.
            if (latestSwitchRef.current !== requestId) return;

            setLang(next);
            globalThis.history.replaceState(null, '', next === 'nl' ? '/nl/' : '/');
            // `instance` is referentially stable for the component's lifetime (see the useState
            // initializer above); everything else referenced is a ref or a stable setter.
        },
        [instance],
    );

    const langSwitchValue = useMemo(() => ({ lang, switchTo }), [lang, switchTo]);

    return (
        <I18nextProvider i18n={instance}>
            <LangSwitchContext.Provider value={langSwitchValue}>
                <PortfolioAppInner />
            </LangSwitchContext.Provider>
        </I18nextProvider>
    );
}
