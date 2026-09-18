'use client';

import React, { type RefObject } from 'react';
import type { SectionSlug } from '../../app/sections';
import type { ActiveSection } from './use_active_section';
import { NAV_ITEMS } from './nav_items';
import NavLink from './nav_link';
import { OpenMenuButton } from './menu_button';

interface NavBarProps {
    menuOpen: boolean;
    onOpenMenu: () => void;
    openButtonRef: RefObject<HTMLButtonElement | null>;
    activeSection: ActiveSection;
    onNavigate: (event: React.MouseEvent<HTMLAnchorElement>, slug?: SectionSlug) => void;
}

const NavBar: React.FC<NavBarProps> = ({ menuOpen, onOpenMenu, openButtonRef, activeSection, onNavigate }) => (
    <div
        aria-hidden={menuOpen}
        inert={menuOpen}
        className="bg-app-surface/90 border-app-border flex items-center justify-end border-b px-4 py-2 backdrop-blur sm:px-6 md:justify-center"
    >
        <ul className="hidden items-center gap-1 overflow-x-auto md:flex md:justify-center md:gap-2">
            {NAV_ITEMS.map((item) => (
                <NavLink
                    key={item.titleKey}
                    item={item}
                    variant="wide"
                    activeSection={activeSection}
                    onNavigate={onNavigate}
                />
            ))}
        </ul>
        <OpenMenuButton menuOpen={menuOpen} onOpenMenu={onOpenMenu} buttonRef={openButtonRef} />
    </div>
);

export default NavBar;
