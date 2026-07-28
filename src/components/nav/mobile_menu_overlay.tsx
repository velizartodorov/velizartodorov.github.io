'use client';

import React, { type RefObject } from 'react';
import type { SectionSlug } from '../../app/sections';
import type { ActiveSection } from './use_active_section';
import { NAV_ITEMS } from './nav_items';
import NavLink from './nav_link';
import { CloseMenuButton } from './menu_button';

const stateClassName = (menuOpen: boolean) =>
    menuOpen ? 'translate-x-0 opacity-100' : 'pointer-events-none -translate-x-2 opacity-0';

interface MobileMenuOverlayProps {
    menuOpen: boolean;
    onCloseMenu: () => void;
    closeButtonRef: RefObject<HTMLButtonElement | null>;
    activeSection: ActiveSection;
    onNavigate: (event: React.MouseEvent<HTMLAnchorElement>, slug?: SectionSlug) => void;
}

const MobileMenuOverlay: React.FC<MobileMenuOverlayProps> = ({
    menuOpen,
    onCloseMenu,
    closeButtonRef,
    activeSection,
    onNavigate,
}) => (
    <div
        data-state={menuOpen ? 'open' : 'closed'}
        aria-hidden={!menuOpen}
        inert={!menuOpen}
        className={`bg-app-surface/50 fixed inset-0 z-10 flex flex-col backdrop-blur-lg transition duration-200 ease-out motion-reduce:transition-none md:hidden ${stateClassName(menuOpen)}`}
    >
        <div className="flex items-center justify-end px-4 py-2 sm:px-6">
            <CloseMenuButton onCloseMenu={onCloseMenu} buttonRef={closeButtonRef} />
        </div>
        <ul className="flex flex-col gap-1 px-2 pt-2 sm:px-4">
            {NAV_ITEMS.map((item) => (
                <NavLink
                    key={item.titleKey}
                    item={item}
                    variant="overlay"
                    activeSection={activeSection}
                    onNavigate={onNavigate}
                />
            ))}
        </ul>
    </div>
);

export default MobileMenuOverlay;
