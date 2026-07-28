'use client';

import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLangSwitch } from '../../app/translations/lang-switch-context';
import { sectionPath, type SectionSlug } from '../../app/sections';
import { useActiveSection } from './use_active_section';

interface NavItem {
    slug?: SectionSlug;
    titleKey: string;
}

const NAV_ITEMS: readonly NavItem[] = [
    { titleKey: 'introduction:title' },
    { slug: 'experience', titleKey: 'employments:title' },
    { slug: 'certifications', titleKey: 'licenses_certifications:title' },
    { slug: 'presentations', titleKey: 'presentations:title' },
    { slug: 'languages', titleKey: 'languages:title' },
    { slug: 'education', titleKey: 'education:title' },
];

// Tailwind's default `md` breakpoint, where the wide row replaces the mobile overlay.
const WIDE_VIEWPORT_QUERY = '(min-width: 768px)';

const Nav: React.FC = () => {
    const { t } = useTranslation();
    const { lang } = useLangSwitch();
    const activeSection = useActiveSection();
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        if (!menuOpen) return;
        document.body.style.overflow = 'hidden';
        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') setMenuOpen(false);
        };
        document.addEventListener('keydown', onKeyDown);

        // The overlay is `md:hidden` and the wide row isn't rendered while it's open, so a
        // viewport that grows past Tailwind's `md` breakpoint (768px) while the menu is open
        // would leave an empty nav and a scroll-locked page with no visible way out. Close it
        // instead, which makes that state unreachable.
        const wideViewport = globalThis.matchMedia(WIDE_VIEWPORT_QUERY);
        const onViewportChange = (event: { matches: boolean }) => {
            if (event.matches) setMenuOpen(false);
        };
        onViewportChange(wideViewport);
        wideViewport.addEventListener('change', onViewportChange);

        return () => {
            document.body.style.overflow = '';
            document.removeEventListener('keydown', onKeyDown);
            wideViewport.removeEventListener('change', onViewportChange);
        };
    }, [menuOpen]);

    const handleClick = (event: React.MouseEvent<HTMLAnchorElement>, slug?: SectionSlug) => {
        event.preventDefault();
        const targetId = slug ?? 'introduction';
        document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        globalThis.history.pushState(null, '', sectionPath(lang, slug));
        setMenuOpen(false);
    };

    const renderLink = ({ slug, titleKey }: NavItem, className: string) => {
        const isActive = (slug ?? 'introduction') === activeSection;
        return (
            <li key={titleKey}>
                <a
                    href={sectionPath(lang, slug)}
                    onClick={(event) => handleClick(event, slug)}
                    aria-current={isActive ? 'page' : undefined}
                    className={className}
                >
                    {t(titleKey)}
                </a>
            </li>
        );
    };

    const wideLinkClassName = ({ slug }: NavItem) =>
        `block rounded-full px-3 py-1.5 text-sm font-medium whitespace-nowrap transition-colors md:text-base ${
            (slug ?? 'introduction') === activeSection
                ? 'bg-app-accent-subtle text-app-accent'
                : 'text-app-text-muted hover:text-app-text'
        }`;

    const overlayLinkClassName = ({ slug }: NavItem) =>
        `block px-4 py-2 text-lg font-semibold ${
            (slug ?? 'introduction') === activeSection ? 'text-app-accent' : 'text-app-text'
        }`;

    return (
        <nav
            aria-label="Sections"
            className="bg-app-surface/90 border-app-border sticky top-0 z-10 border-b backdrop-blur"
        >
            {menuOpen ? (
                <div className="bg-app-surface fixed inset-0 z-10 flex flex-col md:hidden">
                    <div className="flex items-center justify-end px-4 py-2 sm:px-6">
                        <button
                            type="button"
                            aria-label={t('common:nav.closeMenu')}
                            aria-expanded={true}
                            onClick={() => setMenuOpen(false)}
                            className="text-app-text flex size-9 items-center justify-center text-2xl leading-none"
                        >
                            ✕
                        </button>
                    </div>
                    <ul className="flex flex-1 flex-col items-center justify-center gap-8">
                        {NAV_ITEMS.map((item) => renderLink(item, overlayLinkClassName(item)))}
                    </ul>
                </div>
            ) : (
                <div className="flex items-center justify-end px-4 py-2 sm:px-6 md:justify-center">
                    <ul className="hidden items-center gap-1 overflow-x-auto md:flex md:justify-center md:gap-2">
                        {NAV_ITEMS.map((item) => renderLink(item, wideLinkClassName(item)))}
                    </ul>
                    <button
                        type="button"
                        aria-label={t('common:nav.openMenu')}
                        aria-expanded={false}
                        onClick={() => setMenuOpen(true)}
                        className="flex size-9 flex-col items-center justify-center gap-1.5 md:hidden"
                    >
                        <span aria-hidden="true" className="bg-app-text block h-0.5 w-6 rounded-full" />
                        <span aria-hidden="true" className="bg-app-text block h-0.5 w-6 rounded-full" />
                        <span aria-hidden="true" className="bg-app-text block h-0.5 w-6 rounded-full" />
                    </button>
                </div>
            )}
        </nav>
    );
};

export default Nav;
