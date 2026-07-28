import { beforeEach, describe, expect, it, vi } from 'vitest';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mockIntersectionObserver } from '../../test-utils/mock-intersection-observer';
import { mockMatchMedia } from '../../test-utils/mock-match-media';
import { ACCORDION_ROOT_MARGIN, AccordionProvider } from './accordion_provider';
import { ACTIVE_ID_ROOT_MARGIN, Timeline, TimelineEntry } from './timeline';

beforeEach(() => {
    mockMatchMedia();
});

function renderTwoEntries() {
    render(
        <AccordionProvider>
            <Timeline>
                <TimelineEntry id="a" icon={{ src: '/a.png', alt: 'A' }} header="Header A">
                    Entry A
                </TimelineEntry>
                <TimelineEntry id="b" icon={{ src: '/b.png', alt: 'B' }} header="Header B">
                    Entry B
                </TimelineEntry>
            </Timeline>
        </AccordionProvider>,
    );
}

describe('Timeline / TimelineEntry', () => {
    it('renders every entry, none active before any intersection is reported', () => {
        mockIntersectionObserver();
        renderTwoEntries();

        expect(screen.getByText('Entry A')).toBeInTheDocument();
        expect(screen.getByText('Entry B')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'A' })).not.toHaveAttribute('aria-current');
        expect(screen.getByRole('button', { name: 'B' })).not.toHaveAttribute('aria-current');
    });

    it('mounts two Timeline-level observers (activeId + accordion), both watching every entry root', () => {
        const { instances } = mockIntersectionObserver();
        renderTwoEntries();

        const entryA = screen.getByText('Entry A').closest('[data-timeline-entry]') as HTMLElement;
        const entryB = screen.getByText('Entry B').closest('[data-timeline-entry]') as HTMLElement;

        // Child registration effects run before the parent Timeline's own effects (React runs effects
        // bottom-up), so both observers have to be created lazily on the first register()/
        // registerNode() call rather than in a Timeline effect - otherwise these registrations would
        // be silently dropped.
        const observingBoth = instances.filter(
            (i) => i.observedElements.includes(entryA) && i.observedElements.includes(entryB),
        );
        expect(observingBoth).toHaveLength(2);
        expect(observingBoth.map((i) => i.options?.rootMargin).sort()).toEqual(
            [ACTIVE_ID_ROOT_MARGIN, ACCORDION_ROOT_MARGIN].sort(),
        );
    });

    it('marks the topmost intersecting entry as active', () => {
        const { instances } = mockIntersectionObserver();
        renderTwoEntries();

        const entryA = screen.getByText('Entry A').closest('[data-timeline-entry]') as HTMLElement;
        const entryB = screen.getByText('Entry B').closest('[data-timeline-entry]') as HTMLElement;
        const activeIdObserver = instances.find((i) => i.options?.rootMargin === ACTIVE_ID_ROOT_MARGIN)!;

        act(() => {
            activeIdObserver.trigger([
                { isIntersecting: true, target: entryB, boundingClientRect: { top: 200 } as DOMRectReadOnly },
                { isIntersecting: true, target: entryA, boundingClientRect: { top: -20 } as DOMRectReadOnly },
            ]);
        });

        expect(screen.getByRole('button', { name: 'A' })).toHaveAttribute('aria-current', 'true');
        expect(screen.getByRole('button', { name: 'B' })).not.toHaveAttribute('aria-current');
    });

    it('does not re-run a sibling entry registration effect when only the active entry changes', () => {
        const { instances, unobserve } = mockIntersectionObserver();
        renderTwoEntries();

        const entryA = screen.getByText('Entry A').closest('[data-timeline-entry]') as HTMLElement;
        const entryB = screen.getByText('Entry B').closest('[data-timeline-entry]') as HTMLElement;
        const activeIdObserver = instances.find((i) => i.options?.rootMargin === ACTIVE_ID_ROOT_MARGIN)!;
        expect(activeIdObserver.observedElements).toHaveLength(2);

        act(() => {
            activeIdObserver.trigger([
                { isIntersecting: true, target: entryA, boundingClientRect: { top: -20 } as DOMRectReadOnly },
            ]);
        });
        expect(screen.getByRole('button', { name: 'A' })).toHaveAttribute('aria-current', 'true');

        act(() => {
            activeIdObserver.trigger([
                { isIntersecting: true, target: entryB, boundingClientRect: { top: -20 } as DOMRectReadOnly },
            ]);
        });
        expect(screen.getByRole('button', { name: 'B' })).toHaveAttribute('aria-current', 'true');

        expect(activeIdObserver.observedElements).toHaveLength(2);
        expect(unobserve).not.toHaveBeenCalled();
    });

    it('smooth-scrolls to the entry when its marker is clicked', async () => {
        mockIntersectionObserver();
        renderTwoEntries();
        const markerA = screen.getByRole('button', { name: 'A' });
        const root = markerA.closest('[data-timeline-entry]') as HTMLElement;
        root.scrollIntoView = vi.fn();

        await userEvent.click(markerA);

        expect(root.scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth', block: 'start' });
    });

    it("gives each entry's content its own collapsed/opacity classes, leaving its marker always fully visible", () => {
        mockIntersectionObserver();
        renderTwoEntries();

        const marker = screen.getByRole('button', { name: 'A' });
        const content = screen.getByText('Entry A').closest('[data-timeline-content]') as HTMLElement;
        const gridWrapper = content.parentElement!.parentElement!;

        expect(gridWrapper).toHaveClass('grid-rows-[0fr]', 'opacity-0');
        // The marker button is never touched by the accordion - it stays at CSS defaults, so it reads
        // as a permanent landmark on the rail regardless of collapse state.
        expect(marker.className).not.toMatch(/opacity-0/);
    });

    it('renders header outside the faded content, so it stays fully visible while content is collapsed', () => {
        mockIntersectionObserver();
        renderTwoEntries();

        const header = screen.getByText('Header A');
        // Guards against the real regression this fixes: the header used to be nested inside the
        // same revealed-driven grid wrapper as the rest of the entry's content, so it was invisible
        // (and its collapsed zero height let markers of consecutive entries overlap) until a real
        // scroll or chevron click. It must live outside that wrapper and stay at CSS defaults.
        expect(header.style.opacity).toBe('');
        expect(header.closest('[data-timeline-content]')).toBeNull();
    });

    it('renders its own chevron outside the faded content, so it stays visible and clickable while content is collapsed', async () => {
        mockIntersectionObserver();
        renderTwoEntries();

        const content = screen.getByText('Entry A').closest('[data-timeline-content]') as HTMLElement;
        const gridWrapper = content.parentElement!.parentElement!;
        const chevron = screen.getAllByRole('button', { name: 'Expand' })[0]!;

        expect(gridWrapper).toHaveClass('grid-rows-[0fr]', 'opacity-0');
        expect(chevron.style.opacity).toBe('');
        expect(chevron.closest('[data-timeline-content]')).toBeNull();

        await userEvent.click(chevron);

        expect(gridWrapper).toHaveClass('grid-rows-[1fr]', 'opacity-100');
        expect(screen.getAllByRole('button', { name: 'Collapse' })[0]).toBeInTheDocument();
    });

    it('collapses the content to near-zero height while hidden, expanding once the chevron reveals it', async () => {
        mockIntersectionObserver();
        renderTwoEntries();

        const content = screen.getByText('Entry A').closest('[data-timeline-content]') as HTMLElement;
        // The grid-rows collapse wrapper is two ancestors up: grid(rows) > overflow-hidden > content.
        const gridWrapper = content.parentElement!.parentElement!;
        expect(gridWrapper).toHaveClass('grid-rows-[0fr]');

        const chevron = screen.getAllByRole('button', { name: 'Expand' })[0]!;
        await userEvent.click(chevron);

        expect(gridWrapper).toHaveClass('grid-rows-[1fr]');
        expect(gridWrapper).not.toHaveClass('grid-rows-[0fr]');
    });

    it('animates the grid-row height and opacity transition, disabled under prefers-reduced-motion', () => {
        mockIntersectionObserver();
        renderTwoEntries();

        const content = screen.getByText('Entry A').closest('[data-timeline-content]') as HTMLElement;
        const gridWrapper = content.parentElement!.parentElement!;

        expect(gridWrapper).toHaveClass(
            'transition-[grid-template-rows,opacity]',
            'duration-[550ms]',
            'ease-in-out',
            'motion-reduce:transition-none',
        );
    });

    it('renders no chevron and no collapsible content for a childless entry, since it has nothing to reveal', () => {
        const { instances } = mockIntersectionObserver();
        render(
            <AccordionProvider>
                <Timeline>
                    <TimelineEntry id="a" icon={{ src: '/a.png', alt: 'A' }} header="Header A" />
                </Timeline>
            </AccordionProvider>,
        );

        expect(screen.queryByRole('button', { name: 'Expand' })).not.toBeInTheDocument();
        expect(document.querySelector('[data-timeline-content]')).not.toBeInTheDocument();

        const entry = screen.getByText('Header A').closest('[data-timeline-entry]') as HTMLElement;
        const accordion = instances.find((i) => i.options?.rootMargin === ACCORDION_ROOT_MARGIN);
        expect(accordion?.observedElements ?? []).not.toContain(entry);
    });

    it('throws when a TimelineEntry is rendered outside a Timeline', () => {
        const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

        expect(() =>
            render(
                <TimelineEntry id="a" icon={{ src: '/a.png', alt: 'A' }} header="Header">
                    content
                </TimelineEntry>,
            ),
        ).toThrow('TimelineEntry must be used within a Timeline');

        consoleError.mockRestore();
    });
});
