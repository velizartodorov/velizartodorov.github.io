'use client';

import React from 'react';
import { useLangSwitch } from '../../app/translations/lang-switch-context';
import { sectionPath, type SectionSlug } from '../../app/sections';
import { useActiveSection } from './use_active_section';
import { useMobileMenu } from './use_mobile_menu';
import { useSectionUrlSync } from './use_section_url_sync';
import { sectionOf } from './nav_items';
import NavBar from './nav_bar';
import MobileMenuOverlay from './mobile_menu_overlay';

const Nav: React.FC<{ initialSection?: SectionSlug }> = ({ initialSection }) => {
    const { lang } = useLangSwitch();
    const { active: activeSection, pinTo } = useActiveSection(initialSection ?? 'introduction');
    const { menuOpen, openMenu, closeMenu, openButtonRef, closeButtonRef } = useMobileMenu();

    useSectionUrlSync(activeSection, lang);

    const handleClick = (event: React.MouseEvent<HTMLAnchorElement>, slug?: SectionSlug) => {
        event.preventDefault();
        const targetId = sectionOf(slug);
        document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        pinTo(targetId);
        globalThis.history.pushState(null, '', sectionPath(lang, slug));
        closeMenu();
    };

    return (
        <nav aria-label="Sections" className="sticky top-0 z-10">
            <NavBar
                menuOpen={menuOpen}
                onOpenMenu={openMenu}
                openButtonRef={openButtonRef}
                activeSection={activeSection}
                onNavigate={handleClick}
            />
            <MobileMenuOverlay
                menuOpen={menuOpen}
                onCloseMenu={closeMenu}
                closeButtonRef={closeButtonRef}
                activeSection={activeSection}
                onNavigate={handleClick}
            />
        </nav>
    );
};

export default Nav;
