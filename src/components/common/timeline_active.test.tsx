import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, render, renderHook, within } from '@testing-library/react';
import { mockIntersectionObserver } from '../../test-utils/mock-intersection-observer';
import { mockMatchMedia } from '../../test-utils/mock-match-media';
import { Timeline, TimelineEntry } from './timeline';
import { TimelineActiveProvider, useTimelineRegistration } from './timeline_active';

function entry(id: string) {
    return <TimelineEntry key={id} id={id} icon={{ src: `/${id}.png`, alt: id }} header={id} />;
}

function section(...ids: string[]) {
    return <Timeline>{ids.map(entry)}</Timeline>;
}

function sections(...ids: string[]) {
    return ids.map((id) => <Timeline key={id}>{entry(id)}</Timeline>);
}

function renderEntries(ui: React.ReactNode) {
    return render(<TimelineActiveProvider>{ui}</TimelineActiveProvider>);
}

// Locate an entry by the `data-timeline-entry={id}` hook TimelineEntry itself renders, and its
// marker by the single <button> that lives inside that box.
function entryEl(id: string) {
    return document.querySelector(`[data-timeline-entry="${id}"]`) as HTMLElement;
}

function marker(id: string) {
    return within(entryEl(id)).getByRole('button');
}

// jsdom does no layout, so getBoundingClientRect() is all zeros; pin an entry's box (viewport
// coords, px) so the provider's nearest-to-centre scan has something real to read.
function placeEntry(id: string, top: number, height = 100) {
    const rect = { top, height, bottom: top + height, left: 0, right: 0, width: 0, x: 0, y: 0, toJSON: () => {} };
    entryEl(id).getBoundingClientRect = vi.fn(() => rect as DOMRect);
}

function scroll() {
    act(() => window.dispatchEvent(new Event('scroll')));
}

function expectActive(id: string) {
    expect(marker(id)).toHaveAttribute('aria-current', 'true');
}

function expectInactive(id: string) {
    expect(marker(id)).not.toHaveAttribute('aria-current');
}

let io: ReturnType<typeof mockIntersectionObserver>;

beforeEach(() => {
    mockMatchMedia();
    vi.stubGlobal('innerHeight', 800);
    io = mockIntersectionObserver();
});

afterEach(() => {
    vi.unstubAllGlobals();
});

describe('TimelineActiveProvider', () => {
    it('activates the entry whose box centre is nearest the viewport centre', () => {
        renderEntries(section('a', 'b'));

        placeEntry('a', 0); // centre 50, dist 350
        placeEntry('b', 340); // centre 390, dist 10
        scroll();

        expectActive('b');
        expectInactive('a');
    });

    it('keeps a single active entry across two separate Timeline sections', () => {
        renderEntries(sections('a', 'b'));

        placeEntry('a', 600); // centre 650, dist 250
        placeEntry('b', 360); // centre 410, dist 10
        scroll();
        expectActive('b');
        expectInactive('a');

        placeEntry('a', 380); // centre 430, dist 30
        placeEntry('b', -700); // scrolled off the top
        scroll();
        expectActive('a');
        expectInactive('b');
    });

    it('clears the active entry once it scrolls out of the viewport', () => {
        renderEntries(section('a'));

        placeEntry('a', 380);
        scroll();
        expectActive('a');

        placeEntry('a', -400); // bottom = -300, fully above the viewport
        scroll();
        expectInactive('a');
    });

    it('recomputes on the IntersectionObserver callback, not only on native scroll', () => {
        renderEntries(section('a'));

        placeEntry('a', 380);
        act(() => io.instances[0]!.trigger([]));

        expectActive('a');
    });

    it('observes every entry across all sections with one IntersectionObserver', () => {
        renderEntries(sections('a', 'b'));

        const observingBoth = io.instances.filter(
            (i) => i.observedElements.includes(entryEl('a')) && i.observedElements.includes(entryEl('b')),
        );
        expect(observingBoth).toHaveLength(1);
    });

    it('does not re-observe a sibling entry when only the active entry changes', () => {
        renderEntries(section('a', 'b'));
        const observed = io.instances[0]!.observedElements.length;

        placeEntry('a', 380);
        scroll();
        expectActive('a');

        placeEntry('a', 700);
        placeEntry('b', 380);
        scroll();
        expectActive('b');

        expect(io.instances[0]!.observedElements).toHaveLength(observed);
        expect(io.unobserve).not.toHaveBeenCalled();
    });

    it('disconnects the observer and removes the scroll listener on unmount', () => {
        const removeSpy = vi.spyOn(window, 'removeEventListener');
        const { unmount } = renderEntries(section('a'));

        unmount();

        expect(io.disconnect).toHaveBeenCalled();
        expect(removeSpy).toHaveBeenCalledWith('scroll', expect.any(Function));
        removeSpy.mockRestore();
    });
});

describe('useTimelineRegistration', () => {
    it('is inert outside a provider: ref starts unset and the entry is never active', () => {
        const { result } = renderHook(() => useTimelineRegistration());

        expect(result.current.ref.current).toBeNull();
        expect(result.current.isActive).toBe(false);
    });

    it('registers its element on mount and unregisters it when it leaves the tree', () => {
        const el = document.createElement('div');

        function Probe() {
            const { ref } = useTimelineRegistration();
            ref.current = el;
            return null;
        }
        function Harness({ show }: { show: boolean }) {
            return <TimelineActiveProvider>{show ? <Probe /> : null}</TimelineActiveProvider>;
        }

        const { rerender } = render(<Harness show />);
        expect(io.observe).toHaveBeenCalledWith(el);

        rerender(<Harness show={false} />);
        expect(io.unobserve).toHaveBeenCalledWith(el);
    });
});
