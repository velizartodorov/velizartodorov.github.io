import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { mockIntersectionObserver } from '../../test-utils/mock-intersection-observer';
import { useActiveSection } from './use_active_section';

function addSection(id: string) {
    const el = document.createElement('div');
    el.id = id;
    document.body.appendChild(el);
    return el;
}

// jsdom does no layout, so getBoundingClientRect() returns all zeros; pin a section's top edge
// (in px, relative to the viewport) so useActiveSection's "last heading under the nav" scan has
// something real to read.
function placeSection(el: Element, top: number) {
    el.getBoundingClientRect = vi.fn(() => ({ top, bottom: top, height: 0 }) as DOMRect);
}

function renderActiveSection(initialActive?: Parameters<typeof useActiveSection>[0]) {
    return renderHook(() => useActiveSection(initialActive));
}

function notifyObserver(trigger: (entries: Partial<IntersectionObserverEntry>[]) => void) {
    act(() => trigger([]));
}

// atBottom() compares window.innerHeight + window.scrollY against
// document.documentElement.scrollHeight - jsdom does no layout, so scrollHeight defaults to 0,
// which would make atBottom() true by default (innerHeight + scrollY >= 0 - 2 is always true).
// Stub a "plenty of room left to scroll" baseline so existing (non-bottom) tests aren't
// accidentally exercising the bottom-of-document branch; individual tests below override this to
// simulate actually being at the bottom.
function stubScrollPosition({ innerHeight = 800, scrollY = 0, scrollHeight = 2000 } = {}) {
    vi.stubGlobal('innerHeight', innerHeight);
    Object.defineProperty(window, 'scrollY', { value: scrollY, configurable: true });
    Object.defineProperty(document.documentElement, 'scrollHeight', { value: scrollHeight, configurable: true });
}

const AT_BOTTOM = { innerHeight: 800, scrollY: 1200, scrollHeight: 2000 };

beforeEach(() => {
    stubScrollPosition();
});

afterEach(() => {
    document.body.innerHTML = '';
    vi.unstubAllGlobals();
});

describe('useActiveSection', () => {
    it('defaults to "introduction" before any scroll or intersection is reported', () => {
        addSection('introduction');
        mockIntersectionObserver();

        const { result } = renderActiveSection();

        expect(result.current.active).toBe('introduction');
    });

    it('seeds the active section from initialActive (deep-linked /<section>/ load)', () => {
        addSection('introduction');
        addSection('languages');
        mockIntersectionObserver();

        const { result } = renderActiveSection('languages');

        expect(result.current.active).toBe('languages');
    });

    it('activates the last section whose heading has passed under the nav', () => {
        const introduction = addSection('introduction');
        const employments = addSection('employments');
        const certifications = addSection('certifications');
        const { trigger } = mockIntersectionObserver();

        const { result } = renderActiveSection();

        placeSection(introduction, -50);
        placeSection(employments, 10);
        placeSection(certifications, 400);
        notifyObserver(trigger);

        expect(result.current.active).toBe('employments');
    });

    it('does not advance to a section whose heading is still below the nav line', () => {
        const introduction = addSection('introduction');
        const employments = addSection('employments');
        const { trigger } = mockIntersectionObserver();

        const { result } = renderActiveSection();

        placeSection(introduction, -50);
        placeSection(employments, 500);
        notifyObserver(trigger);

        expect(result.current.active).toBe('introduction');
    });

    it('recomputes on a native scroll event, not only on observer callbacks', () => {
        const introduction = addSection('introduction');
        const languages = addSection('languages');
        mockIntersectionObserver();

        const { result } = renderActiveSection();

        placeSection(introduction, -400);
        placeSection(languages, 40);
        act(() => window.dispatchEvent(new Event('scroll')));

        expect(result.current.active).toBe('languages');
    });

    it('does not observe when no known section ids are present in the DOM', () => {
        const { observe } = mockIntersectionObserver();

        renderActiveSection();

        expect(observe).not.toHaveBeenCalled();
    });

    describe('pinTo', () => {
        it('holds the pinned section against observer callbacks, then resumes on a user scroll', () => {
            const introduction = addSection('introduction');
            const languages = addSection('languages');
            const education = addSection('education');
            const { trigger } = mockIntersectionObserver();

            const { result } = renderActiveSection();

            placeSection(introduction, -900);
            placeSection(languages, 300);
            placeSection(education, 500);

            act(() => result.current.pinTo('languages'));
            notifyObserver(trigger);
            act(() => window.dispatchEvent(new Event('scroll')));
            expect(result.current.active).toBe('languages');

            placeSection(languages, -50);
            placeSection(education, 40);
            act(() => window.dispatchEvent(new Event('wheel')));
            expect(result.current.active).toBe('education');
        });

        it('releases the pin after the fallback timeout when no user scroll arrives', () => {
            vi.useFakeTimers();
            try {
                const introduction = addSection('introduction');
                const languages = addSection('languages');
                const education = addSection('education');
                mockIntersectionObserver();

                const { result } = renderActiveSection();

                placeSection(introduction, -900);
                placeSection(languages, -50);
                placeSection(education, 40);

                act(() => result.current.pinTo('languages'));
                expect(result.current.active).toBe('languages');

                act(() => {
                    vi.advanceTimersByTime(1200);
                    window.dispatchEvent(new Event('scroll'));
                });
                expect(result.current.active).toBe('education');
            } finally {
                vi.useRealTimers();
            }
        });
    });

    describe('last-section bottom-of-document detection', () => {
        it('force-selects the last section at max scroll when the section under the nav has scrolled off the top', () => {
            const introduction = addSection('introduction');
            const employments = addSection('employments');
            const education = addSection('education');
            stubScrollPosition(AT_BOTTOM);
            const { trigger } = mockIntersectionObserver();

            const { result } = renderActiveSection();

            placeSection(introduction, -800);
            placeSection(employments, -600);
            placeSection(education, 400);
            notifyObserver(trigger);

            expect(result.current.active).toBe(education.id);
        });

        it('keeps a section pinned under the nav active at max scroll instead of jumping to the last section', () => {
            const introduction = addSection('introduction');
            const languages = addSection('languages');
            const education = addSection('education');
            stubScrollPosition(AT_BOTTOM);
            const { trigger } = mockIntersectionObserver();

            const { result } = renderActiveSection();

            placeSection(introduction, -900);
            placeSection(languages, 80);
            placeSection(education, 300);
            notifyObserver(trigger);

            expect(result.current.active).toBe('languages');
        });

        it('keeps a deep-linked trailing section active at max scroll even when an earlier heading sits under the nav', () => {
            const introduction = addSection('introduction');
            const presentations = addSection('presentations');
            const languages = addSection('languages');
            const education = addSection('education');
            stubScrollPosition(AT_BOTTOM);
            const { trigger } = mockIntersectionObserver();

            const { result } = renderActiveSection('languages');

            // The page is clamped at the bottom: #languages can't reach the top, so #presentations
            // shares the final screen and sits under the nav line - the plain scan would pick it.
            placeSection(introduction, -900);
            placeSection(presentations, 80);
            placeSection(languages, 200);
            placeSection(education, 420);
            notifyObserver(trigger);

            expect(result.current.active).toBe('languages');
        });

        it('stops honouring the deep-linked section once the visitor scrolls', () => {
            const introduction = addSection('introduction');
            const presentations = addSection('presentations');
            const languages = addSection('languages');
            const education = addSection('education');
            stubScrollPosition(AT_BOTTOM);
            const { trigger } = mockIntersectionObserver();

            const { result } = renderActiveSection('languages');

            placeSection(introduction, -900);
            placeSection(presentations, 80);
            placeSection(languages, 200);
            placeSection(education, 420);
            notifyObserver(trigger);
            expect(result.current.active).toBe('languages');

            // A real scroll gesture hands control back to the plain scan: #presentations is the
            // last heading under the nav on that final screen.
            act(() => window.dispatchEvent(new Event('wheel')));

            expect(result.current.active).toBe('presentations');
        });

        it('sets the last section active on a native scroll event that reaches the bottom, without positioning any section', () => {
            addSection('introduction');
            addSection('employments');
            const education = addSection('education');
            mockIntersectionObserver();

            const { result } = renderActiveSection();

            act(() => {
                stubScrollPosition(AT_BOTTOM);
                window.dispatchEvent(new Event('scroll'));
            });

            expect(result.current.active).toBe(education.id);
        });

        it('does not force the last section when not at the bottom', () => {
            const introduction = addSection('introduction');
            const employments = addSection('employments');
            addSection('education');
            stubScrollPosition({ innerHeight: 800, scrollY: 0, scrollHeight: 2000 });
            const { trigger } = mockIntersectionObserver();

            const { result } = renderActiveSection();

            placeSection(introduction, 10);
            placeSection(employments, 600);
            notifyObserver(trigger);

            expect(result.current.active).toBe('introduction');
        });

        it('removes the scroll listener and disconnects the observer on unmount', () => {
            addSection('introduction');
            const { disconnect } = mockIntersectionObserver();
            const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');

            const { unmount } = renderActiveSection();
            unmount();

            expect(disconnect).toHaveBeenCalled();
            expect(removeEventListenerSpy).toHaveBeenCalledWith('scroll', expect.any(Function));
            removeEventListenerSpy.mockRestore();
        });
    });
});
