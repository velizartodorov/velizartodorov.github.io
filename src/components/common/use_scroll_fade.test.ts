import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { mockIntersectionObserver } from '../../test-utils/mock-intersection-observer';
import { mockMatchMedia } from '../../test-utils/mock-match-media';
import { useScrollFade } from './use_scroll_fade';

// Returns a stable ref object alongside the element - a fresh `{ current: el }` literal recreated
// on every render would tear down and rebuild the whole effect. A real component's useRef() is
// stable across renders; this mirrors that here.
function makeElement(rect: Partial<DOMRect>) {
    const el = document.createElement('div');
    el.getBoundingClientRect = () => rect as DOMRect;
    document.body.appendChild(el);
    const ref = { current: el as HTMLElement | null };
    return { el, ref };
}

beforeEach(() => {
    vi.stubGlobal('innerHeight', 800);
    vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => {
        cb(0);
        return 0;
    });
    vi.stubGlobal('cancelAnimationFrame', () => {});
});

afterEach(() => {
    document.body.innerHTML = '';
    vi.unstubAllGlobals();
});

describe('useScrollFade', () => {
    it.each([
        { name: 'not yet entered (top edge at viewport bottom)', rect: { top: 800, bottom: 1100 }, expected: '0' },
        { name: 'halfway through the entry ramp', rect: { top: 680, bottom: 980 }, expected: '0.5' },
        { name: 'comfortably inside the viewport', rect: { top: 400, bottom: 700 }, expected: '1' },
        { name: 'halfway through the exit ramp', rect: { top: -500, bottom: 176 }, expected: '0.5' },
    ])('computes opacity on mount: $name', ({ rect, expected }) => {
        mockIntersectionObserver();
        mockMatchMedia();
        const { el, ref } = makeElement(rect);

        renderHook(() => useScrollFade(ref));

        expect(el.style.opacity).toBe(expected);
    });

    it('recomputes opacity on scroll while gated near the viewport', () => {
        const { trigger } = mockIntersectionObserver();
        mockMatchMedia();
        const { el, ref } = makeElement({ top: 800, bottom: 1100 });

        renderHook(() => useScrollFade(ref));
        expect(el.style.opacity).toBe('0');

        act(() => {
            trigger([{ isIntersecting: true, target: el }]);
            el.getBoundingClientRect = () => ({ top: 400, bottom: 700 }) as DOMRect;
            window.dispatchEvent(new Event('scroll'));
        });

        expect(el.style.opacity).toBe('1');
    });

    it('stays fully visible under prefers-reduced-motion, unaffected by scroll', () => {
        mockIntersectionObserver();
        mockMatchMedia(true);
        const { el, ref } = makeElement({ top: 400, bottom: 700 });

        renderHook(() => useScrollFade(ref));

        expect(el.style.opacity).toBe('1');

        // No scroll listener should even be attached - a scroll must not change anything.
        el.getBoundingClientRect = () => ({ top: 800, bottom: 1100 }) as DOMRect;
        window.dispatchEvent(new Event('scroll'));
        expect(el.style.opacity).toBe('1');
    });

    it('disconnects the observer and removes scroll/resize listeners on unmount', () => {
        const { disconnect, trigger } = mockIntersectionObserver();
        mockMatchMedia();
        const { el, ref } = makeElement({ top: 800, bottom: 1100 });
        const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');

        const { unmount } = renderHook(() => useScrollFade(ref));
        act(() => {
            trigger([{ isIntersecting: true, target: el }]);
        });
        unmount();

        expect(disconnect).toHaveBeenCalled();
        expect(removeEventListenerSpy).toHaveBeenCalledWith('scroll', expect.any(Function));
        expect(removeEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function));
        removeEventListenerSpy.mockRestore();
    });

    it('coalesces multiple scroll events into a single recompute', () => {
        const rafCallbacks: Array<(time: number) => void> = [];
        let rafId = 0;
        vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => {
            rafCallbacks.push(cb);
            return ++rafId;
        });

        const { trigger } = mockIntersectionObserver();
        mockMatchMedia();
        const { el, ref } = makeElement({ top: 800, bottom: 1100 });

        renderHook(() => useScrollFade(ref));
        expect(el.style.opacity).toBe('0');

        rafCallbacks.length = 0;

        act(() => {
            trigger([{ isIntersecting: true, target: el }]);
            if (rafCallbacks.length > 0) {
                rafCallbacks[0](0);
            }
        });
        rafCallbacks.length = 0;

        el.getBoundingClientRect = () => ({ top: 400, bottom: 700 }) as DOMRect;

        window.dispatchEvent(new Event('scroll'));
        window.dispatchEvent(new Event('scroll'));
        window.dispatchEvent(new Event('scroll'));

        expect(rafCallbacks).toHaveLength(1);

        act(() => {
            rafCallbacks[0]!(0);
        });

        expect(el.style.opacity).toBe('1');
    });
});
