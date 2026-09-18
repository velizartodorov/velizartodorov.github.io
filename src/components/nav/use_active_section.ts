'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { SECTIONS, type SectionSlug } from '../../app/sections';
import { STICKY_NAV_OFFSET_PX } from '../common/nav_metrics';

export type ActiveSection = SectionSlug | 'introduction';

export interface ActiveSectionApi {
    active: ActiveSection;
    pinTo: (section: ActiveSection) => void;
}

const OBSERVED_IDS: readonly ActiveSection[] = ['introduction', ...SECTIONS];

const ROOT_MARGIN = `-${STICKY_NAV_OFFSET_PX}px 0px -70% 0px`;

const PIN_FALLBACK_RELEASE_MS = 1200;

export function useActiveSection(initialActive: ActiveSection = 'introduction'): ActiveSectionApi {
    const [active, setActive] = useState<ActiveSection>(initialActive);
    const pinnedRef = useRef(false);
    const targetRef = useRef<ActiveSection | null>(initialActive === 'introduction' ? null : initialActive);
    const releaseTimerRef = useRef<number | undefined>(undefined);

    const pinTo = useCallback((section: ActiveSection) => {
        pinnedRef.current = true;
        targetRef.current = section;
        window.clearTimeout(releaseTimerRef.current);
        releaseTimerRef.current = window.setTimeout(() => {
            pinnedRef.current = false;
        }, PIN_FALLBACK_RELEASE_MS);
        setActive(section);
    }, []);

    useEffect(() => {
        const elements = OBSERVED_IDS.map((id) => document.getElementById(id)).filter(
            (el): el is HTMLElement => el !== null,
        );
        if (elements.length === 0) return;

        const atBottom = () => window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;

        const updateActive = () => {
            if (pinnedRef.current) return;

            let current = elements[0]!;
            for (const el of elements) {
                if (el.getBoundingClientRect().top <= STICKY_NAV_OFFSET_PX) current = el;
                else break;
            }
            if (atBottom()) {
                const target = targetRef.current ? elements.find((el) => el.id === targetRef.current) : undefined;
                if (target) {
                    current = target;
                } else if (current.getBoundingClientRect().top < 0) {
                    current = elements.at(-1)!;
                }
            }
            setActive(current.id as ActiveSection);
        };

        const releasePin = () => {
            if (!pinnedRef.current && targetRef.current === null) return;
            pinnedRef.current = false;
            targetRef.current = null;
            window.clearTimeout(releaseTimerRef.current);
            updateActive();
        };

        const listeners: [string, () => void, AddEventListenerOptions?][] = [
            ['scroll', updateActive, { passive: true }],
            ['wheel', releasePin, { passive: true }],
            ['touchmove', releasePin, { passive: true }],
            ['keydown', releasePin],
        ];

        const observer = new IntersectionObserver(() => updateActive(), { rootMargin: ROOT_MARGIN, threshold: 0 });
        for (const el of elements) observer.observe(el);
        for (const [type, handler, options] of listeners) window.addEventListener(type, handler, options);

        return () => {
            observer.disconnect();
            for (const [type, handler] of listeners) window.removeEventListener(type, handler);
            window.clearTimeout(releaseTimerRef.current);
        };
    }, []);

    return { active, pinTo };
}
