import React, { useEffect, useRef } from 'react';
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Education from './components/education/education';
import Employments from './components/employments/employments';
import Footer from './components/footer/footer';
import Header from './components/header/header';
import Presentations from './components/presentations/presentations';
import Languages from './components/languages/languages';
import Introduction from './components/introduction/introduction';
import { useProfile } from './components/header/profile.init';
import LicensesCertifications from './components/licenses_certifications/licenses_certifications';
import EnvBanner from './components/common/env_banner';

globalThis.React = React;

const SITE_URL = 'https://velizartodorov.github.io';

function setLink(selector: string, attrs: Record<string, string>): void {
    let el = document.querySelector<HTMLLinkElement>(selector);
    if (!el) {
        el = document.createElement('link');
        document.head.appendChild(el);
    }
    for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
}

function PageContent({ lang }: { lang: 'en' | 'nl' }) {
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

export function LangRoute({ lang }: { lang: 'en' | 'nl' }) {
    const { i18n } = useTranslation();

    useEffect(() => {
        void i18n.changeLanguage(lang);
        document.documentElement.lang = lang;
        const canonical = lang === 'nl' ? `${SITE_URL}/nl/` : `${SITE_URL}/`;
        setLink('link[rel="canonical"]', { rel: 'canonical', href: canonical });
        setLink('link[hreflang="en"]', { rel: 'alternate', hreflang: 'en', href: `${SITE_URL}/` });
        setLink('link[hreflang="nl"]', {
            rel: 'alternate',
            hreflang: 'nl',
            href: `${SITE_URL}/nl/`,
        });
        setLink('link[hreflang="x-default"]', {
            rel: 'alternate',
            hreflang: 'x-default',
            href: `${SITE_URL}/`,
        });
    }, [lang]);

    return <PageContent lang={lang} />;
}

export function App() {
    const { name } = useProfile();
    useEffect(() => {
        document.title = name;
    }, [name]);

    return (
        <Router basename="/">
            <EnvBanner />
            <Header />
            <Routes>
                <Route path="/" element={<LangRoute lang="en" />} />
                <Route path="/nl" element={<LangRoute lang="nl" />} />
                <Route path="/nl/" element={<LangRoute lang="nl" />} />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            <Footer />
        </Router>
    );
}
