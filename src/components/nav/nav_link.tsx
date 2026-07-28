'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLangSwitch } from '../../app/translations/lang-switch-context';
import { sectionPath, type SectionSlug } from '../../app/sections';
import type { ActiveSection } from './use_active_section';
import { sectionOf, type NavItem } from './nav_items';

const ACTIVE_LINK_CLASS = 'bg-app-accent-subtle text-app-accent';

const LINK_VARIANT = {
    wide: {
        base: 'block rounded-full px-3 py-1.5 text-sm font-medium whitespace-nowrap transition-colors md:text-base',
        inactive: 'text-app-text-muted hover:text-app-text',
    },
    overlay: {
        base: 'block w-full rounded-lg px-4 py-3 text-lg font-medium transition-colors',
        inactive: 'text-app-text hover:bg-app-surface-alt',
    },
} as const;

export type NavLinkVariant = keyof typeof LINK_VARIANT;

const linkClassName = (variant: NavLinkVariant, active: boolean) =>
    `${LINK_VARIANT[variant].base} ${active ? ACTIVE_LINK_CLASS : LINK_VARIANT[variant].inactive}`;

interface NavLinkProps {
    item: NavItem;
    variant: NavLinkVariant;
    activeSection: ActiveSection;
    onNavigate: (event: React.MouseEvent<HTMLAnchorElement>, slug?: SectionSlug) => void;
}

const NavLink: React.FC<NavLinkProps> = ({ item, variant, activeSection, onNavigate }) => {
    const { t } = useTranslation();
    const { lang } = useLangSwitch();
    const active = sectionOf(item.slug) === activeSection;

    return (
        <li>
            <a
                href={sectionPath(lang, item.slug)}
                onClick={(event) => onNavigate(event, item.slug)}
                aria-current={active ? 'page' : undefined}
                className={linkClassName(variant, active)}
            >
                {t(item.titleKey)}
            </a>
        </li>
    );
};

export default NavLink;
