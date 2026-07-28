'use client';

import React, { type RefObject } from 'react';
import { useTranslation } from 'react-i18next';

const MENU_BAR_CLASS = 'bg-app-text h-0.5 w-6 rounded-full';

interface OpenMenuButtonProps {
    menuOpen: boolean;
    onOpenMenu: () => void;
    buttonRef: RefObject<HTMLButtonElement | null>;
}

export const OpenMenuButton: React.FC<OpenMenuButtonProps> = ({ menuOpen, onOpenMenu, buttonRef }) => {
    const { t } = useTranslation();
    return (
        <button
            ref={buttonRef}
            type="button"
            aria-label={t('common:nav.openMenu')}
            aria-expanded={menuOpen}
            onClick={onOpenMenu}
            className="flex size-9 flex-col items-center justify-center gap-1.5 md:hidden"
        >
            {['top', 'middle', 'bottom'].map((bar) => (
                <span key={bar} aria-hidden="true" className={`${MENU_BAR_CLASS} block`} />
            ))}
        </button>
    );
};

interface CloseMenuButtonProps {
    onCloseMenu: () => void;
    buttonRef: RefObject<HTMLButtonElement | null>;
}

export const CloseMenuButton: React.FC<CloseMenuButtonProps> = ({ onCloseMenu, buttonRef }) => {
    const { t } = useTranslation();
    return (
        <button
            ref={buttonRef}
            type="button"
            aria-label={t('common:nav.closeMenu')}
            aria-expanded={true}
            onClick={onCloseMenu}
            className="relative flex size-9 items-center justify-center"
        >
            <span aria-hidden="true" className={`${MENU_BAR_CLASS} absolute rotate-45`} />
            <span aria-hidden="true" className={`${MENU_BAR_CLASS} absolute -rotate-45`} />
        </button>
    );
};
