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

beforeEach(() => {
    stubScrollPosition();
});

afterEach(() => {
    document.body.innerHTML = '';
    vi.unstubAllGlobals();
});

describe('useActiveSection', () => {
    it('defaults to "introduction" before any intersection is reported', () => {
        addSection('introduction');
        mockIntersectionObserver();

        const { result } = renderHook(() => useActiveSection());

        expect(result.current).toBe('introduction');
    });

    it('updates to the topmost intersecting section', () => {
        const introduction = addSection('introduction');
        const experience = addSection('experience');
        const { trigger } = mockIntersectionObserver();

        const { result } = renderHook(() => useActiveSection());

        act(() => {
            trigger([
                { isIntersecting: true, target: experience, boundingClientRect: { top: 10 } as DOMRectReadOnly },
                { isIntersecting: true, target: introduction, boundingClientRect: { top: -50 } as DOMRectReadOnly },
            ]);
        });

        expect(result.current).toBe('introduction');
    });

    it('ignores sections that are not currently intersecting', () => {
        const introduction = addSection('introduction');
        const experience = addSection('experience');
        const { trigger } = mockIntersectionObserver();

        const { result } = renderHook(() => useActiveSection());

        act(() => {
            trigger([
                { isIntersecting: false, target: introduction, boundingClientRect: { top: -50 } as DOMRectReadOnly },
                { isIntersecting: true, target: experience, boundingClientRect: { top: 10 } as DOMRectReadOnly },
            ]);
        });

        expect(result.current).toBe('experience');
    });

    it('does not observe when no known section ids are present in the DOM', () => {
        const { observe } = mockIntersectionObserver();

        renderHook(() => useActiveSection());

        expect(observe).not.toHaveBeenCalled();
    });

    describe('last-section bottom-of-document detection', () => {
        it('force-selects the last section when at the bottom of the document, even if entries suggest an earlier one', () => {
            const introduction = addSection('introduction');
            addSection('experience');
            const education = addSection('education');
            stubScrollPosition({ innerHeight: 800, scrollY: 1200, scrollHeight: 2000 });
            const { trigger } = mockIntersectionObserver();

            const { result } = renderHook(() => useActiveSection());

            act(() => {
                // Entries themselves point at "introduction" (topmost intersecting) - the
                // bottom-of-document check must override this and pick the last real section.
                trigger([
                    {
                        isIntersecting: true,
                        target: introduction,
                        boundingClientRect: { top: -50 } as DOMRectReadOnly,
                    },
                ]);
            });

            expect(result.current).toBe(education.id);
        });

        it('keeps the existing topmost-intersecting behavior when not at the bottom', () => {
            const introduction = addSection('introduction');
            const experience = addSection('experience');
            addSection('education');
            stubScrollPosition({ innerHeight: 800, scrollY: 0, scrollHeight: 2000 });
            const { trigger } = mockIntersectionObserver();

            const { result } = renderHook(() => useActiveSection());

            act(() => {
                trigger([
                    { isIntersecting: true, target: experience, boundingClientRect: { top: 10 } as DOMRectReadOnly },
                    {
                        isIntersecting: true,
                        target: introduction,
                        boundingClientRect: { top: -50 } as DOMRectReadOnly,
                    },
                ]);
            });

            expect(result.current).toBe('introduction');
        });

        it('sets the last section active on a native scroll event that reaches the bottom, without an observer entry', () => {
            addSection('introduction');
            addSection('experience');
            const education = addSection('education');
            mockIntersectionObserver();

            const { result } = renderHook(() => useActiveSection());

            act(() => {
                stubScrollPosition({ innerHeight: 800, scrollY: 1200, scrollHeight: 2000 });
                window.dispatchEvent(new Event('scroll'));
            });

            expect(result.current).toBe(education.id);
        });

        it('removes the scroll listener and disconnects the observer on unmount', () => {
            addSection('introduction');
            const { disconnect } = mockIntersectionObserver();
            const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');

            const { unmount } = renderHook(() => useActiveSection());
            unmount();

            expect(disconnect).toHaveBeenCalled();
            expect(removeEventListenerSpy).toHaveBeenCalledWith('scroll', expect.any(Function));
            removeEventListenerSpy.mockRestore();
        });
    });
});
