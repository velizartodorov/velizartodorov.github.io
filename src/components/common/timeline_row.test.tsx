import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mockIntersectionObserver } from '../../test-utils/mock-intersection-observer';
import { mockMatchMedia } from '../../test-utils/mock-match-media';
import { renderInTimelineEntry } from '../../test-utils/render-in-timeline-entry';
import { CHEVRON_TOGGLE_LABEL } from './chevron_toggle_button';
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

    it('renders collapsed by default', () => {
        mockIntersectionObserver();
        mockMatchMedia();
        renderInTimelineEntry(<TimelineRow id="r">row content</TimelineRow>);

        const content = screen.getByText('row content').closest('[data-timeline-row-content]') as HTMLElement;
        const gridWrapper = content.parentElement!.parentElement!;
        expect(gridWrapper).toHaveClass('grid-rows-[0fr]');
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
        const chevron = within(row).getByRole('button', { name: CHEVRON_TOGGLE_LABEL.closed });

        expect(gridWrapper).toHaveClass('grid-rows-[0fr]');
        expect(chevron.style.opacity).toBe('');
        expect(chevron.closest('[data-timeline-row-content]')).toBeNull();

        expect(chevron).toHaveAttribute('aria-expanded', 'false');
        await userEvent.click(chevron);

        expect(gridWrapper).toHaveClass('grid-rows-[1fr]');
        expect(within(row).getByRole('button', { name: CHEVRON_TOGGLE_LABEL.open })).toHaveAttribute(
            'aria-expanded',
            'true',
        );
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
        const chevron = within(row).getByRole('button', { name: CHEVRON_TOGGLE_LABEL.closed });
        await userEvent.click(chevron);

        expect(gridWrapper).toHaveClass('grid-rows-[1fr]');
        expect(gridWrapper).not.toHaveClass('grid-rows-[0fr]');
    });

    it('animates the grid-row height transition, disabled under prefers-reduced-motion', () => {
        mockIntersectionObserver();
        mockMatchMedia();
        renderInTimelineEntry(<TimelineRow id="r">row content</TimelineRow>);

        const content = screen.getByText('row content').closest('[data-timeline-row-content]') as HTMLElement;
        const gridWrapper = content.parentElement!.parentElement!;

        expect(gridWrapper).toHaveClass(
            'transition-[grid-template-rows]',
            'duration-200',
            'ease-out',
            'motion-reduce:transition-none',
        );
    });

    it('lets its chevron expand the row, then close it again as a real toggle', async () => {
        mockIntersectionObserver();
        mockMatchMedia();
        renderInTimelineEntry(<TimelineRow id="r">row content</TimelineRow>);

        const content = screen.getByText('row content').closest('[data-timeline-row-content]') as HTMLElement;
        const row = content.closest('[data-timeline-row]') as HTMLElement;
        const gridWrapper = content.parentElement!.parentElement!;
        // Scoped to the row itself throughout - the ancestor TimelineEntry renders its own
        // "Expand"/"Collapse" chevron too, so an unscoped query would match both.
        const chevron = within(row).getByRole('button', { name: CHEVRON_TOGGLE_LABEL.closed });
        expect(chevron).toHaveAttribute('aria-expanded', 'false');
        expect(gridWrapper).toHaveClass('grid-rows-[0fr]');

        await userEvent.click(chevron);

        expect(gridWrapper).toHaveClass('grid-rows-[1fr]');
        expect(within(row).getByRole('button', { name: CHEVRON_TOGGLE_LABEL.open })).toHaveAttribute(
            'aria-expanded',
            'true',
        );

        await userEvent.click(within(row).getByRole('button', { name: CHEVRON_TOGGLE_LABEL.open }));

        expect(within(row).getByRole('button', { name: CHEVRON_TOGGLE_LABEL.closed })).toHaveAttribute(
            'aria-expanded',
            'false',
        );
        expect(gridWrapper).toHaveClass('grid-rows-[0fr]');
    });

    it('throws when used outside a TimelineEntry', () => {
        const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
        mockIntersectionObserver();
        mockMatchMedia();

        expect(() => render(<TimelineRow id="r">content</TimelineRow>)).toThrow(
            'TimelineRow must be used within a TimelineEntry',
        );

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
        expect(within(row).queryByRole('button', { name: CHEVRON_TOGGLE_LABEL.closed })).not.toBeInTheDocument();
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
