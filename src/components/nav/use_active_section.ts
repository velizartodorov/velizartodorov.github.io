'use client';

import { useEffect, useState } from 'react';
import { SECTIONS, type SectionSlug } from '../../app/sections';

export type ActiveSection = SectionSlug | 'introduction';

const OBSERVED_IDS: readonly ActiveSection[] = ['introduction', ...SECTIONS];

// Biases "in view" toward the top of the viewport (below the sticky nav) rather than requiring
// a section to fill most of the screen, so the highlight switches roughly when a section's
// heading passes under the nav bar.
const ROOT_MARGIN = '-96px 0px -70% 0px';

export function useActiveSection(): ActiveSection {
    const [active, setActive] = useState<ActiveSection>('introduction');

    useEffect(() => {
        const elements = OBSERVED_IDS.map((id) => document.getElementById(id)).filter(
            (el): el is HTMLElement => el !== null,
        );
        if (elements.length === 0) return;

        // The last section on the page can't always be pushed into the detection band near the
        // top of the viewport - scrollIntoView({block:'start'}) may run out of scroll headroom
        // once the browser is already at max scroll, clamping the section's top below the band.
        // It then never intersects, so the previous section (whose box still straddles the band)
        // would otherwise wrongly win. Force-select the last section whenever the page is at (or
        // past) its maximum scroll position, regardless of what the observer itself reports.
        const lastId = elements.at(-1)!.id as ActiveSection;
        const atBottom = () => window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;

        const observer = new IntersectionObserver(
            (entries) => {
                if (atBottom()) {
                    setActive(lastId);
                    return;
                }
                const visible = entries
                    .filter((entry) => entry.isIntersecting)
                    .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
                const topEntry = visible[0];
                if (topEntry) setActive(topEntry.target.id as ActiveSection);
            },
            { rootMargin: ROOT_MARGIN, threshold: 0 },
        );

        for (const el of elements) observer.observe(el);

        const onScroll = () => {
            if (atBottom()) setActive(lastId);
        };
        window.addEventListener('scroll', onScroll, { passive: true });

        return () => {
            observer.disconnect();
            window.removeEventListener('scroll', onScroll);
        };
    }, []);

    return active;
}
