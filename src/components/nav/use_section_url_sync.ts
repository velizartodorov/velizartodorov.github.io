'use client';

import { useEffect, useRef } from 'react';
import { sectionPath, type SectionSlug } from '../../app/sections';
import type { Language } from '../../app/translations/i18n';
import type { ActiveSection } from './use_active_section';

const slugOf = (section: ActiveSection): SectionSlug | undefined => (section === 'introduction' ? undefined : section);

export function useSectionUrlSync(activeSection: ActiveSection, lang: Language): void {
    const skipInitialSync = useRef(true);

    useEffect(() => {
        if (skipInitialSync.current) {
            skipInitialSync.current = false;
            return;
        }
        const nextPath = sectionPath(lang, slugOf(activeSection));
        if (globalThis.location.pathname !== nextPath) {
            globalThis.history.replaceState(null, '', nextPath);
        }
    }, [activeSection, lang]);
}
