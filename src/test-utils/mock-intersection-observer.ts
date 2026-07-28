import { vi } from 'vitest';

type Callback = (entries: Partial<IntersectionObserverEntry>[]) => void;

export interface ObserverInstance {
    observedElements: Element[];
    options?: IntersectionObserverInit;
    trigger(entries: Partial<IntersectionObserverEntry>[]): void;
}

// Stubs window.IntersectionObserver, which jsdom doesn't implement. Returns `trigger` (targets
// whichever observer was constructed most recently) for simple single-observer tests. Some
// components mount more than one IntersectionObserver at once (e.g. Timeline's own activeId
// scrollspy alongside its separate accordion-band observer) - `instances` exposes every
// constructed observer with the elements and constructor options it was given, so a test can
// target the right one via `instances.find(i => i.options?.rootMargin === SOME_MARGIN)` instead of
// relying on construction order.
export function mockIntersectionObserver() {
    let latestCallback: Callback | undefined;
    const observe = vi.fn();
    const disconnect = vi.fn();
    const unobserve = vi.fn();
    const instances: ObserverInstance[] = [];

    class FakeIntersectionObserver {
        observe: (el: Element) => void;
        disconnect = disconnect;
        unobserve = unobserve;

        constructor(callback: Callback, options?: IntersectionObserverInit) {
            latestCallback = callback;
            const observedElements: Element[] = [];
            this.observe = (el: Element) => {
                observedElements.push(el);
                observe(el);
            };
            instances.push({
                observedElements,
                options,
                trigger: (entries) => callback(entries as IntersectionObserverEntry[]),
            });
        }
    }

    vi.stubGlobal('IntersectionObserver', FakeIntersectionObserver);

    return {
        observe,
        disconnect,
        unobserve,
        instances,
        trigger(entries: Partial<IntersectionObserverEntry>[]) {
            latestCallback?.(entries as IntersectionObserverEntry[]);
        },
    };
}
