import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mockIntersectionObserver } from '../../test-utils/mock-intersection-observer';
import { mockMatchMedia } from '../../test-utils/mock-match-media';
import { renderInTimelineEntry } from '../../test-utils/render-in-timeline-entry';
import { ACCORDION_ROOT_MARGIN, AccordionProvider } from './accordion_provider';
import { Timeline, TimelineEntry } from './timeline';
import { TimelineRail, TimelineRow } from './timeline_row';

beforeEach(() => {
    vi.stubGlobal('innerHeight', 800);
});

afterEach(() => {
    vi.unstubAllGlobals();
});

describe('TimelineRow', () => {
    it('renders its children and the dot-marker classes, appending any extra className', () => {
        mockIntersectionObserver();
        mockMatchMedia();
        renderInTimelineEntry(
            <TimelineRow id="r" className="mt-4">
                row content
            </TimelineRow>,
        );

        const row = screen.getByText('row content').closest('[data-timeline-row]') as HTMLElement;
        expect(row).toHaveClass('relative', 'before:bg-app-accent', 'hover:before:scale-[1.15]', 'mt-4');
    });

    it('registers its own root with the accordion, collapsed until the accordion reaches it', () => {
        const { instances } = mockIntersectionObserver();
        mockMatchMedia();
        renderInTimelineEntry(<TimelineRow id="r">row content</TimelineRow>);

        const content = screen.getByText('row content').closest('[data-timeline-row-content]') as HTMLElement;
        const row = content.closest('[data-timeline-row]') as HTMLElement;
        const gridWrapper = content.parentElement!.parentElement!;
        // Registered on the row's own root, not the content wrapper - the content wrapper is
        // clipped to zero visible size by its own grid-rows-[0fr] collapse, so an observer
        // watching it directly could never report intersecting.
        const accordion = instances.find((i) => i.options?.rootMargin === ACCORDION_ROOT_MARGIN)!;
        expect(accordion.observedElements).toContain(row);
        expect(gridWrapper).toHaveClass('grid-rows-[0fr]', 'opacity-0');
    });

    it('never registers a childless row with the accordion, since it has nothing to reveal', () => {
        const { instances } = mockIntersectionObserver();
        mockMatchMedia();
        renderInTimelineEntry(<TimelineRow id="r" header="header only" />);

        const row = screen.getByText('header only').closest('[data-timeline-row]') as HTMLElement;
        const accordion = instances.find((i) => i.options?.rootMargin === ACCORDION_ROOT_MARGIN);
        expect(accordion?.observedElements ?? []).not.toContain(row);
    });

    it('renders its chevron outside the faded content, so it stays visible and clickable while collapsed', async () => {
        mockIntersectionObserver();
        mockMatchMedia();
        renderInTimelineEntry(<TimelineRow id="r">row content</TimelineRow>);

        const content = screen.getByText('row content').closest('[data-timeline-row-content]') as HTMLElement;
        const row = content.closest('[data-timeline-row]') as HTMLElement;
        const gridWrapper = content.parentElement!.parentElement!;
        // Scoped to the row itself, not screen - the ancestor TimelineEntry renders its own
        // "Expand"/"Collapse" chevron too, so an unscoped query would match both.
        const chevron = within(row).getByRole('button', { name: 'Expand' });

        expect(gridWrapper).toHaveClass('grid-rows-[0fr]', 'opacity-0');
        expect(chevron.style.opacity).toBe('');
        expect(chevron.closest('[data-timeline-row-content]')).toBeNull();

        expect(chevron).toHaveAttribute('aria-expanded', 'false');
        await userEvent.click(chevron);

        expect(gridWrapper).toHaveClass('grid-rows-[1fr]', 'opacity-100');
        expect(within(row).getByRole('button', { name: 'Collapse' })).toHaveAttribute('aria-expanded', 'true');
    });

    it('collapses the content to near-zero height while hidden, expanding once the chevron reveals it', async () => {
        mockIntersectionObserver();
        mockMatchMedia();
        renderInTimelineEntry(<TimelineRow id="r">row content</TimelineRow>);

        const content = screen.getByText('row content').closest('[data-timeline-row-content]') as HTMLElement;
        const row = content.closest('[data-timeline-row]') as HTMLElement;
        const gridWrapper = content.parentElement!.parentElement!;
        expect(gridWrapper).toHaveClass('grid-rows-[0fr]');

        // Scoped to the row itself - the ancestor TimelineEntry renders its own "Expand" chevron
        // too, so an unscoped query would match both.
        const chevron = within(row).getByRole('button', { name: 'Expand' });
        await userEvent.click(chevron);

        expect(gridWrapper).toHaveClass('grid-rows-[1fr]');
        expect(gridWrapper).not.toHaveClass('grid-rows-[0fr]');
    });

    it('animates the grid-row height and opacity transition, disabled under prefers-reduced-motion', () => {
        mockIntersectionObserver();
        mockMatchMedia();
        renderInTimelineEntry(<TimelineRow id="r">row content</TimelineRow>);

        const content = screen.getByText('row content').closest('[data-timeline-row-content]') as HTMLElement;
        const gridWrapper = content.parentElement!.parentElement!;

        expect(gridWrapper).toHaveClass(
            'transition-[grid-template-rows,opacity]',
            'duration-200',
            'ease-out',
            'motion-reduce:transition-none',
        );
    });

    it('lets its chevron pin the row open, independently of the accordion, then close it again as a real toggle', async () => {
        mockIntersectionObserver();
        mockMatchMedia();
        renderInTimelineEntry(<TimelineRow id="r">row content</TimelineRow>);

        const content = screen.getByText('row content').closest('[data-timeline-row-content]') as HTMLElement;
        const row = content.closest('[data-timeline-row]') as HTMLElement;
        const gridWrapper = content.parentElement!.parentElement!;
        // Scoped to the row itself throughout - the ancestor TimelineEntry renders its own
        // "Expand"/"Collapse" chevron too, so an unscoped query would match both.
        const chevron = within(row).getByRole('button', { name: 'Expand' });
        expect(chevron).toHaveAttribute('aria-expanded', 'false');
        expect(gridWrapper).toHaveClass('grid-rows-[0fr]');

        await userEvent.click(chevron);

        expect(gridWrapper).toHaveClass('grid-rows-[1fr]');
        expect(within(row).getByRole('button', { name: 'Collapse' })).toHaveAttribute('aria-expanded', 'true');

        await userEvent.click(within(row).getByRole('button', { name: 'Collapse' }));

        expect(within(row).getByRole('button', { name: 'Expand' })).toHaveAttribute('aria-expanded', 'false');
        expect(gridWrapper).toHaveClass('grid-rows-[0fr]');
    });

    it('throws when used outside a TimelineEntry', () => {
        const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
        mockIntersectionObserver();
        mockMatchMedia();

        expect(() =>
            render(
                <AccordionProvider>
                    <TimelineRow id="r">content</TimelineRow>
                </AccordionProvider>,
            ),
        ).toThrow('TimelineRow must be used within a TimelineEntry');

        consoleError.mockRestore();
    });
});

describe('TimelineRow header', () => {
    it('renders header outside the faded content, always visible even before any scroll', () => {
        mockIntersectionObserver();
        mockMatchMedia();
        renderInTimelineEntry(
            <TimelineRow id="r" header="row header">
                row content
            </TimelineRow>,
        );

        const header = screen.getByText('row header');
        const content = screen.getByText('row content').closest('[data-timeline-row-content]') as HTMLElement;
        const gridWrapper = content.parentElement!.parentElement!;
        expect(header.style.opacity).toBe('');
        expect(header.closest('[data-timeline-row-content]')).toBeNull();
        expect(gridWrapper).toHaveClass('grid-rows-[0fr]');
    });

    it('renders no chevron when there is no collapsible content, since there is nothing to toggle', () => {
        mockIntersectionObserver();
        mockMatchMedia();
        renderInTimelineEntry(<TimelineRow id="r" header="row header" />);

        const header = screen.getByText('row header');
        expect(header).toBeInTheDocument();
        const row = header.closest('[data-timeline-row]') as HTMLElement;
        // Scoped to the row itself - the ancestor TimelineEntry renders its own "Expand" chevron,
        // so an unscoped query would find that one instead of proving the row has none.
        expect(within(row).queryByRole('button', { name: 'Expand' })).not.toBeInTheDocument();
    });
});

describe('TimelineRail', () => {
    it('renders the connecting-line classes plus the caller-supplied spacing', () => {
        mockIntersectionObserver();
        mockMatchMedia();
        renderInTimelineEntry(<TimelineRail className="space-y-7">rail content</TimelineRail>);

        expect(screen.getByText('rail content')).toHaveClass('relative', 'before:bg-app-border', 'space-y-7');
    });
});

describe('scroll accordion (nested under a real Timeline)', () => {
    function renderEntryWithRowAndSibling() {
        return render(
            <AccordionProvider>
                <Timeline>
                    <TimelineEntry id="e1" icon={{ src: '/a.png', alt: 'A' }} header="Entry 1">
                        <TimelineRail>
                            <TimelineRow id="r1" header="Row 1">
                                row 1 content
                            </TimelineRow>
                        </TimelineRail>
                    </TimelineEntry>
                    <TimelineEntry id="e2" icon={{ src: '/b.png', alt: 'B' }} header="Entry 2">
                        entry 2 content
                    </TimelineEntry>
                </Timeline>
            </AccordionProvider>,
        );
    }

    function gridWrapperFor(selector: string) {
        const content = document.querySelector(selector) as HTMLElement;
        return content.parentElement!.parentElement!;
    }

    it('reveals a row and keeps its parent entry structurally expanded without opening a sibling entry', () => {
        const { instances } = mockIntersectionObserver();
        mockMatchMedia();
        renderEntryWithRowAndSibling();

        const entry1 = screen.getByText('Entry 1').closest('[data-timeline-entry]') as HTMLElement;
        const row1 = screen.getByText('Row 1').closest('[data-timeline-row]') as HTMLElement;
        const accordion = instances.find((i) => i.options?.rootMargin === ACCORDION_ROOT_MARGIN)!;
        const entry1Grid = gridWrapperFor('[data-timeline-content="e1"]');
        const row1Grid = gridWrapperFor('[data-timeline-row-content]');

        act(() => {
            window.dispatchEvent(new Event('scroll'));
            accordion.trigger([{ isIntersecting: true, target: entry1 }]);
        });
        expect(entry1Grid).toHaveClass('grid-rows-[1fr]');
        expect(row1Grid).toHaveClass('grid-rows-[0fr]');

        act(() => {
            accordion.trigger([{ isIntersecting: true, target: row1 }]);
        });
        expect(entry1Grid).toHaveClass('grid-rows-[1fr]');
        expect(row1Grid).toHaveClass('grid-rows-[1fr]');
    });

    it('closes a previously open row, and its parent entry, once a later sibling entry is reached', () => {
        const { instances } = mockIntersectionObserver();
        mockMatchMedia();
        renderEntryWithRowAndSibling();

        const entry1 = screen.getByText('Entry 1').closest('[data-timeline-entry]') as HTMLElement;
        const entry2 = screen.getByText('Entry 2').closest('[data-timeline-entry]') as HTMLElement;
        const row1 = screen.getByText('Row 1').closest('[data-timeline-row]') as HTMLElement;
        const accordion = instances.find((i) => i.options?.rootMargin === ACCORDION_ROOT_MARGIN)!;
        const entry1Grid = gridWrapperFor('[data-timeline-content="e1"]');

        act(() => {
            window.dispatchEvent(new Event('scroll'));
            accordion.trigger([{ isIntersecting: true, target: entry1 }]);
            accordion.trigger([{ isIntersecting: true, target: row1 }]);
        });
        expect(entry1Grid).toHaveClass('grid-rows-[1fr]');

        act(() => {
            accordion.trigger([{ isIntersecting: true, target: entry2 }]);
        });
        expect(entry1Grid).toHaveClass('grid-rows-[0fr]');
    });
});
