import { describe, expect, it } from 'vitest';
import { act, render, screen } from '@testing-library/react';
import { mockIntersectionObserver } from '../../test-utils/mock-intersection-observer';
import { mockMatchMedia } from '../../test-utils/mock-match-media';
import { AccordionProvider, ACCORDION_ROOT_MARGIN } from './accordion_provider';
import { Timeline, TimelineEntry } from './timeline';

function gridWrapperFor(text: string) {
    return screen.getByText(text).closest('[data-timeline-content]')!.parentElement!.parentElement!;
}

describe('AccordionProvider', () => {
    it('shares one open item across multiple Timeline instances, matching the real page layout (separate sections, one shared pool)', () => {
        const { instances } = mockIntersectionObserver();
        mockMatchMedia();
        render(
            <AccordionProvider>
                <Timeline>
                    <TimelineEntry id="job-1" icon={{ src: '/a.png', alt: 'A' }} header="Job 1">
                        Job 1 content
                    </TimelineEntry>
                </Timeline>
                <Timeline>
                    <TimelineEntry id="cert-1" icon={{ src: '/b.png', alt: 'B' }} header="Cert 1">
                        Cert 1 content
                    </TimelineEntry>
                </Timeline>
            </AccordionProvider>,
        );

        const job1 = screen.getByText('Job 1').closest('[data-timeline-entry]') as HTMLElement;
        const cert1 = screen.getByText('Cert 1').closest('[data-timeline-entry]') as HTMLElement;
        const accordion = instances.find((i) => i.options?.rootMargin === ACCORDION_ROOT_MARGIN)!;
        const job1Grid = gridWrapperFor('Job 1 content');
        const cert1Grid = gridWrapperFor('Cert 1 content');

        act(() => {
            window.dispatchEvent(new Event('scroll'));
            accordion.trigger([{ isIntersecting: true, target: job1 }]);
        });
        expect(job1Grid).toHaveClass('grid-rows-[1fr]');
        expect(cert1Grid).toHaveClass('grid-rows-[0fr]');

        // A later entry in a DIFFERENT Timeline instance (a different page section) still closes
        // the one open in the first Timeline - the pool is page-wide, not per-Timeline. This is
        // exactly the real page's structure: Employments/Education/Licenses each mount their own
        // Timeline for activeId purposes, but must share one accordion.
        act(() => {
            accordion.trigger([{ isIntersecting: true, target: cert1 }]);
        });
        expect(job1Grid).toHaveClass('grid-rows-[0fr]');
        expect(cert1Grid).toHaveClass('grid-rows-[1fr]');
    });

    it('does not open anything before a real scroll/resize has happened, and never reopens something already passed', () => {
        const { instances } = mockIntersectionObserver();
        mockMatchMedia();
        render(
            <AccordionProvider>
                <Timeline>
                    <TimelineEntry id="a" icon={{ src: '/a.png', alt: 'A' }} header="A">
                        A content
                    </TimelineEntry>
                    <TimelineEntry id="b" icon={{ src: '/b.png', alt: 'B' }} header="B">
                        B content
                    </TimelineEntry>
                </Timeline>
            </AccordionProvider>,
        );

        const a = screen.getByText('A').closest('[data-timeline-entry]') as HTMLElement;
        const b = screen.getByText('B').closest('[data-timeline-entry]') as HTMLElement;
        const accordion = instances.find((i) => i.options?.rootMargin === ACCORDION_ROOT_MARGIN)!;
        const aGrid = gridWrapperFor('A content');

        act(() => {
            accordion.trigger([{ isIntersecting: true, target: a }]);
        });
        expect(aGrid).toHaveClass('grid-rows-[0fr]');

        act(() => {
            window.dispatchEvent(new Event('scroll'));
            accordion.trigger([{ isIntersecting: true, target: a }]);
            accordion.trigger([{ isIntersecting: true, target: b }]);
        });
        // A separate act() from the a/b advance above - the openPathRef read by the observer
        // callback is only updated on render, so a same-tick re-trigger of `a` (as could happen if
        // this were batched into the act() above) would still see the pre-advance ref and wrongly
        // reopen it. A real browser never delivers three IntersectionObserver callbacks for the
        // same observer synchronously in one tick, so this mirrors real usage while still proving
        // the "already passed" guard holds once the pointer has actually advanced to `b`.
        act(() => {
            accordion.trigger([{ isIntersecting: true, target: a }]);
        });
        expect(aGrid).toHaveClass('grid-rows-[0fr]');
    });
});
