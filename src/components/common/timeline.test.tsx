import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mockIntersectionObserver } from '../../test-utils/mock-intersection-observer';
import { mockMatchMedia } from '../../test-utils/mock-match-media';
import { CHEVRON_TOGGLE_LABEL } from './chevron_toggle_button';
import { Timeline, TimelineEntry } from './timeline';

beforeEach(() => {
    mockMatchMedia();
});

function renderChildlessEntries(count: number) {
    render(
        <Timeline>
            {Array.from({ length: count }, (_, i) => (
                <TimelineEntry
                    key={i}
                    id={String(i)}
                    icon={{ src: `/${i}.png`, alt: `M${i}` }}
                    header={`Header ${i}`}
                />
            ))}
        </Timeline>,
    );
}

function railSegmentsOf(markerName: string) {
    const root = screen.getByRole('button', { name: markerName }).closest('[data-timeline-entry]') as HTMLElement;
    return [...root.querySelectorAll('[data-timeline-rail]')].map((el) => el.className);
}

function renderTwoEntries() {
    render(
        <Timeline>
            <TimelineEntry id="a" icon={{ src: '/a.png', alt: 'A' }} header="Header A">
                Entry A
            </TimelineEntry>
            <TimelineEntry id="b" icon={{ src: '/b.png', alt: 'B' }} header="Header B">
                Entry B
            </TimelineEntry>
        </Timeline>,
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

    it('smooth-scrolls to the entry when its marker is clicked', async () => {
        mockIntersectionObserver();
        renderTwoEntries();
        const markerA = screen.getByRole('button', { name: 'A' });
        const root = markerA.closest('[data-timeline-entry]') as HTMLElement;
        root.scrollIntoView = vi.fn();

        await userEvent.click(markerA);

        expect(root.scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth', block: 'start' });
    });

    it("gives each entry's content its own collapsed class, leaving its marker always fully visible", () => {
        mockIntersectionObserver();
        renderTwoEntries();

        const marker = screen.getByRole('button', { name: 'A' });
        const content = screen.getByText('Entry A').closest('[data-timeline-content]') as HTMLElement;
        const gridWrapper = content.parentElement!.parentElement!;

        expect(gridWrapper).toHaveClass('grid-rows-[0fr]');
        // The marker button is never touched by the collapse - it stays at CSS defaults, so it reads
        // as a permanent landmark on the rail regardless of collapse state.
        expect(marker.className).not.toMatch(/grid-rows-\[0fr\]/);
    });

    it('renders header outside the faded content, so it stays fully visible while content is collapsed', () => {
        mockIntersectionObserver();
        renderTwoEntries();

        const header = screen.getByText('Header A');
        // Guards against the real regression this fixes: the header used to be nested inside the
        // same revealed-driven grid wrapper as the rest of the entry's content, so it was invisible
        // (and its collapsed zero height let markers of consecutive entries overlap) until a chevron
        // click. It must live outside that wrapper and stay at CSS defaults.
        expect(header.style.opacity).toBe('');
        expect(header.closest('[data-timeline-content]')).toBeNull();
    });

    it('renders its own chevron outside the faded content, so it stays visible and clickable while content is collapsed', async () => {
        mockIntersectionObserver();
        renderTwoEntries();

        const content = screen.getByText('Entry A').closest('[data-timeline-content]') as HTMLElement;
        const gridWrapper = content.parentElement!.parentElement!;
        const chevron = screen.getAllByRole('button', { name: CHEVRON_TOGGLE_LABEL.closed })[0]!;

        expect(gridWrapper).toHaveClass('grid-rows-[0fr]');
        expect(chevron.style.opacity).toBe('');
        expect(chevron.closest('[data-timeline-content]')).toBeNull();

        await userEvent.click(chevron);

        expect(gridWrapper).toHaveClass('grid-rows-[1fr]');
        expect(screen.getAllByRole('button', { name: CHEVRON_TOGGLE_LABEL.open })[0]).toBeInTheDocument();
    });

    it('collapses the content to near-zero height while hidden, expanding once the chevron reveals it', async () => {
        mockIntersectionObserver();
        renderTwoEntries();

        const content = screen.getByText('Entry A').closest('[data-timeline-content]') as HTMLElement;
        // The grid-rows collapse wrapper is two ancestors up: grid(rows) > overflow-hidden > content.
        const gridWrapper = content.parentElement!.parentElement!;
        expect(gridWrapper).toHaveClass('grid-rows-[0fr]');

        const chevron = screen.getAllByRole('button', { name: CHEVRON_TOGGLE_LABEL.closed })[0]!;
        await userEvent.click(chevron);

        expect(gridWrapper).toHaveClass('grid-rows-[1fr]');
        expect(gridWrapper).not.toHaveClass('grid-rows-[0fr]');
    });

    it('animates the grid-row height transition, disabled under prefers-reduced-motion', () => {
        mockIntersectionObserver();
        renderTwoEntries();

        const content = screen.getByText('Entry A').closest('[data-timeline-content]') as HTMLElement;
        const gridWrapper = content.parentElement!.parentElement!;

        expect(gridWrapper).toHaveClass(
            'transition-[grid-template-rows]',
            'duration-200',
            'ease-out',
            'motion-reduce:transition-none',
        );
    });

    it('renders no chevron and no collapsible content for a childless entry, since it has nothing to reveal', () => {
        mockIntersectionObserver();
        render(
            <Timeline>
                <TimelineEntry id="a" icon={{ src: '/a.png', alt: 'A' }} header="Header A" />
            </Timeline>,
        );

        expect(screen.queryByRole('button', { name: CHEVRON_TOGGLE_LABEL.closed })).not.toBeInTheDocument();
        expect(document.querySelector('[data-timeline-content]')).not.toBeInTheDocument();
    });

    it('adds dark:invert to the icon image only when icon.invertOnDark is set', () => {
        mockIntersectionObserver();
        render(
            <Timeline>
                <TimelineEntry id="a" icon={{ src: '/a.png', alt: 'A', invertOnDark: true }} header="Header A" />
                <TimelineEntry id="b" icon={{ src: '/b.png', alt: 'B' }} header="Header B" />
            </Timeline>,
        );

        expect(document.querySelector('img[src="/a.png"]')).toHaveClass('dark:invert');
        expect(document.querySelector('img[src="/b.png"]')).not.toHaveClass('dark:invert');
    });

    it('uses object-contain for the icon only when icon.fit is "contain", object-cover otherwise', () => {
        mockIntersectionObserver();
        render(
            <Timeline>
                <TimelineEntry id="a" icon={{ src: '/a.png', alt: 'A', fit: 'contain' }} header="Header A" />
                <TimelineEntry id="b" icon={{ src: '/b.png', alt: 'B' }} header="Header B" />
            </Timeline>,
        );

        expect(document.querySelector('img[src="/a.png"]')).toHaveClass('object-contain');
        expect(document.querySelector('img[src="/b.png"]')).toHaveClass('object-cover');
    });

    it('stops the connecting rail at the first and last markers, running it full-height between', () => {
        mockIntersectionObserver();
        renderChildlessEntries(3);

        // First entry: only a downward segment (nothing above its marker).
        expect(railSegmentsOf('M0')).toEqual([expect.stringMatching(/top-1\/2/)]);
        // Middle entry: a segment on each side of its marker.
        expect(railSegmentsOf('M1')).toEqual([expect.stringMatching(/bottom-1\/2/), expect.stringMatching(/top-1\/2/)]);
        // Last entry: only an upward segment (nothing below its marker).
        expect(railSegmentsOf('M2')).toEqual([expect.stringMatching(/bottom-1\/2/)]);
    });

    it('draws no rail for a lone entry, since there is nothing to connect', () => {
        mockIntersectionObserver();
        renderChildlessEntries(1);

        expect(railSegmentsOf('M0')).toEqual([]);
    });

    it('extends the rail past the last marker only while that entry is expanded', async () => {
        mockIntersectionObserver();
        render(
            <Timeline>
                <TimelineEntry id="a" icon={{ src: '/a.png', alt: 'A' }} header="Header A" />
                <TimelineEntry id="b" icon={{ src: '/b.png', alt: 'B' }} header="Header B">
                    Entry B
                </TimelineEntry>
            </Timeline>,
        );

        expect(railSegmentsOf('B')).toEqual([expect.stringMatching(/bottom-1\/2/)]);

        await userEvent.click(screen.getAllByRole('button', { name: CHEVRON_TOGGLE_LABEL.closed })[0]!);

        // The downward header segment plus the segment running alongside the revealed content.
        expect(railSegmentsOf('B')).toEqual([
            expect.stringMatching(/bottom-1\/2/),
            expect.stringMatching(/top-1\/2/),
            expect.stringMatching(/-bottom-1\.5/),
        ]);
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
