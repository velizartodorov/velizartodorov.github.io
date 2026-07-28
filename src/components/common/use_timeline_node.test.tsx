import { afterEach, describe, expect, it, vi } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { ReactNode } from 'react';
import { mockIntersectionObserver, ObserverInstance } from '../../test-utils/mock-intersection-observer';
import { ACCORDION_ROOT_MARGIN, AccordionProvider } from './accordion_provider';
import { useTimelineNode } from './use_timeline_node';

function wrapper({ children }: { children: ReactNode }) {
    return <AccordionProvider>{children}</AccordionProvider>;
}

function makeRef() {
    const el = document.createElement('div');
    document.body.appendChild(el);
    return { current: el as HTMLElement | null };
}

function findAccordionObserver(instances: ObserverInstance[]): ObserverInstance {
    return instances.find((i) => i.options?.rootMargin === ACCORDION_ROOT_MARGIN)!;
}

afterEach(() => {
    document.body.innerHTML = '';
});

describe('useTimelineNode', () => {
    it('throws when used outside an AccordionProvider', () => {
        const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
        const ref = makeRef();

        expect(() => renderHook(() => useTimelineNode(['a'], ref))).toThrow(
            'useTimelineNode must be used within an AccordionProvider',
        );

        consoleError.mockRestore();
    });

    it('starts collapsed and registers its element with the accordion observer', () => {
        const { instances } = mockIntersectionObserver();
        const ref = makeRef();

        const { result } = renderHook(() => useTimelineNode(['a'], ref), { wrapper });

        expect(result.current.revealed).toBe(false);
        expect(findAccordionObserver(instances).observedElements).toContain(ref.current);
    });

    it('does not open from the observer before a real scroll/resize has fired', () => {
        const { instances } = mockIntersectionObserver();
        const ref = makeRef();

        const { result } = renderHook(() => useTimelineNode(['a'], ref), { wrapper });
        const accordion = findAccordionObserver(instances);

        act(() => {
            accordion.trigger([{ isIntersecting: true, target: ref.current! }]);
        });

        expect(result.current.revealed).toBe(false);
    });

    it('opens once the band is entered after a real scroll', () => {
        const { instances } = mockIntersectionObserver();
        const ref = makeRef();

        const { result } = renderHook(() => useTimelineNode(['a'], ref), { wrapper });
        const accordion = findAccordionObserver(instances);

        act(() => {
            window.dispatchEvent(new Event('scroll'));
            accordion.trigger([{ isIntersecting: true, target: ref.current! }]);
        });

        expect(result.current.revealed).toBe(true);
    });

    it('closes an earlier open node when a later one enters the band, and never reopens on the way back up', () => {
        const { instances } = mockIntersectionObserver();
        const firstRef = makeRef();
        const secondRef = makeRef();

        const { result } = renderHook(
            () => ({
                first: useTimelineNode(['a'], firstRef),
                second: useTimelineNode(['b'], secondRef),
            }),
            { wrapper },
        );
        const accordion = findAccordionObserver(instances);

        act(() => {
            window.dispatchEvent(new Event('scroll'));
            accordion.trigger([{ isIntersecting: true, target: firstRef.current! }]);
        });
        expect(result.current.first.revealed).toBe(true);
        expect(result.current.second.revealed).toBe(false);

        act(() => {
            accordion.trigger([{ isIntersecting: true, target: secondRef.current! }]);
        });
        expect(result.current.first.revealed).toBe(false);
        expect(result.current.second.revealed).toBe(true);

        // Scrolling back up re-enters the first node's band - it must stay closed.
        act(() => {
            accordion.trigger([{ isIntersecting: true, target: firstRef.current! }]);
        });
        expect(result.current.first.revealed).toBe(false);
        expect(result.current.second.revealed).toBe(true);
    });

    it('reveals a node whose path is an ancestor of the open path, even though it is not itself the open node', () => {
        const { instances } = mockIntersectionObserver();
        const entryRef = makeRef();
        const rowRef = makeRef();

        const { result } = renderHook(
            () => ({
                entry: useTimelineNode(['a'], entryRef),
                row: useTimelineNode(['a', 'r'], rowRef),
            }),
            { wrapper },
        );
        const accordion = findAccordionObserver(instances);

        act(() => {
            window.dispatchEvent(new Event('scroll'));
            accordion.trigger([{ isIntersecting: true, target: rowRef.current! }]);
        });

        expect(result.current.row.revealed).toBe(true);
        expect(result.current.entry.revealed).toBe(true);
    });

    it('stays observed by the accordion for the duration of its mounted life', () => {
        const { instances } = mockIntersectionObserver();
        const ref = makeRef();

        const { unmount } = renderHook(() => useTimelineNode(['a'], ref), { wrapper });
        const accordion = findAccordionObserver(instances);

        expect(accordion.observedElements).toContain(ref.current);
        unmount();
    });

    it('lets togglePin override independently of the accordion, taking over permanently once used', () => {
        mockIntersectionObserver();
        const ref = makeRef();

        const { result } = renderHook(() => useTimelineNode(['a'], ref), { wrapper });
        expect(result.current.revealed).toBe(false);

        act(() => result.current.togglePin());
        expect(result.current.revealed).toBe(true);

        act(() => result.current.togglePin());
        expect(result.current.revealed).toBe(false);
    });

    it('keeps a manually-pinned node open even after the accordion pointer advances past it', () => {
        const { instances } = mockIntersectionObserver();
        const firstRef = makeRef();
        const secondRef = makeRef();

        const { result } = renderHook(
            () => ({
                first: useTimelineNode(['a'], firstRef),
                second: useTimelineNode(['b'], secondRef),
            }),
            { wrapper },
        );
        const accordion = findAccordionObserver(instances);

        act(() => result.current.first.togglePin());
        expect(result.current.first.revealed).toBe(true);

        act(() => {
            window.dispatchEvent(new Event('scroll'));
            accordion.trigger([{ isIntersecting: true, target: secondRef.current! }]);
        });

        expect(result.current.first.revealed).toBe(true);
        expect(result.current.second.revealed).toBe(true);
    });
});
