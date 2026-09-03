'use client';

import { useCallback, useEffect, useRef, useState, type RefObject } from 'react';

const WIDE_VIEWPORT_QUERY = '(min-width: 768px)';

export interface MobileMenu {
    menuOpen: boolean;
    openMenu: () => void;
    closeMenu: () => void;
    openButtonRef: RefObject<HTMLButtonElement | null>;
    closeButtonRef: RefObject<HTMLButtonElement | null>;
}

export function useMobileMenu(): MobileMenu {
    const [menuOpen, setMenuOpen] = useState(false);
    const openButtonRef = useRef<HTMLButtonElement>(null);
    const closeButtonRef = useRef<HTMLButtonElement>(null);
    const hasOpened = useRef(false);

    const openMenu = useCallback(() => setMenuOpen(true), []);
    const closeMenu = useCallback(() => setMenuOpen(false), []);

    useEffect(() => {
        if (menuOpen) {
            hasOpened.current = true;
            closeButtonRef.current?.focus();
        } else if (hasOpened.current) {
            openButtonRef.current?.focus();
        }
    }, [menuOpen]);

    useEffect(() => {
        if (!menuOpen) return;

        document.body.style.overflow = 'hidden';
        document.body.dataset.navMenuOpen = 'true';

        const closeOnEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') setMenuOpen(false);
        };
        document.addEventListener('keydown', closeOnEscape);

        const wideViewport = globalThis.matchMedia(WIDE_VIEWPORT_QUERY);
        const closeOnWideViewport = (event: { matches: boolean }) => {
            if (event.matches) setMenuOpen(false);
        };
        closeOnWideViewport(wideViewport);
        wideViewport.addEventListener('change', closeOnWideViewport);

        return () => {
            document.body.style.overflow = '';
            delete document.body.dataset.navMenuOpen;
            document.removeEventListener('keydown', closeOnEscape);
            wideViewport.removeEventListener('change', closeOnWideViewport);
        };
    }, [menuOpen]);

    return { menuOpen, openMenu, closeMenu, openButtonRef, closeButtonRef };
}
