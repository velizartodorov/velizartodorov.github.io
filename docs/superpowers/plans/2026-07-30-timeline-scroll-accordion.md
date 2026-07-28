# Timeline scroll accordion — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace `TimelineEntry`/`TimelineRow`'s independent, continuous, one-way scroll-fade reveal with a single shared, discrete, one-open-at-a-time accordion driven by scroll, per
`docs/superpowers/specs/2026-07-30-timeline-scroll-accordion-design.md`.

**Architecture:** `Timeline` owns one piece of shared state (`openPath: string[] | null`) plus a
single `IntersectionObserver` watching a thin band under the nav. Every collapsible node (a
`TimelineEntry`'s content, or a `TimelineRow`'s content) registers into that pool with a path
(`[entryId]` or `[entryId, rowId]`). A node is revealed when its path equals or is an ancestor of
`openPath`. The pointer only ever advances to a node later in document order than the current one
(compared via `compareDocumentPosition` on the real elements), which is what makes scrolling back
up never reopen anything, without tracking scroll direction directly. A manual chevron click hands
that one node permanent, independent "manually pinned" ownership, unaffected by the pointer from
then on.

**Tech Stack:** React 19 function components + hooks, TypeScript, Tailwind v4 utility classes,
Vitest + Testing Library, `IntersectionObserver` (mocked via `src/test-utils/mock-intersection-observer.ts`).

## Global Constraints

- No continuous/JS-computed opacity ramp for `TimelineEntry`/`TimelineRow` content — `revealed` is
  a plain boolean, and both height and opacity are plain Tailwind classes driven by it.
- The accordion pointer only ever moves to a node **later** in document order than the current one
  — never track raw scroll direction as a separate signal; forward-only comparison is what
  produces "reveal only scrolling down, never reopen scrolling back up."
- A manual chevron click is fully independent of the scroll pointer (per the approved spec) — it
  can leave more than one node open, and once clicked, that node ignores the pointer forever.
- `Timeline`'s existing `activeId` scrollspy (nav-marker highlighting) is untouched — same
  rootMargin, same behavior, same `register`/`unregister`. The new accordion pool is a **separate**
  `IntersectionObserver` with its own registration functions, deliberately not reusing `activeId`'s
  observer or margin.
- Verify type changes with `npx tsc --noEmit` (Vitest's esbuild transform does not type-check);
  delete the resulting `tsconfig.tsbuildinfo` afterward — never commit it.
- New shared test helpers go in `src/test-utils/*.ts`, are excluded from Vitest's own test
  discovery by naming (no `.test.` in the filename), and are already covered by
  `sonar-project.properties`'s existing `src/test-utils/**` glob — no per-file Sonar edit needed.
- Follow the existing fixture rules in `CLAUDE.md` (reuse `mockIntersectionObserver`/`mockMatchMedia`,
  collapse near-identical cases with `it.each` only when the cases genuinely share shape).

---

### Task 1: Pure accordion path/ordering helpers

**Files:**
- Create: `src/components/common/timeline_accordion.ts`
- Test: `src/components/common/timeline_accordion.test.ts`

**Interfaces:**
- Produces: `type NodePath = string[]`; `pathKey(path: NodePath): string`;
  `isOnOpenPath(path: NodePath, openPath: NodePath | null): boolean`;
  `interface AccordionCandidate { path: NodePath; el: Element }`;
  `pickAdvanceCandidate(candidates: AccordionCandidate[], openEl: Element | null): AccordionCandidate | null`.
  These four are consumed by Task 3's `Timeline` and `useTimelineNode`.

- [ ] **Step 1: Write the failing test**

```ts
// src/components/common/timeline_accordion.test.ts
import { afterEach, describe, expect, it } from 'vitest';
import { isOnOpenPath, pathKey, pickAdvanceCandidate } from './timeline_accordion';

describe('pathKey', () => {
    it('produces equal keys for equal paths and distinct keys for distinct paths', () => {
        expect(pathKey(['a'])).toBe(pathKey(['a']));
        expect(pathKey(['a'])).not.toBe(pathKey(['b']));
        expect(pathKey(['a'])).not.toBe(pathKey(['a', 'b']));
    });
});

describe('isOnOpenPath', () => {
    it('is false when nothing is open', () => {
        expect(isOnOpenPath(['a'], null)).toBe(false);
    });

    it('is true for the open node itself', () => {
        expect(isOnOpenPath(['a', 'b'], ['a', 'b'])).toBe(true);
    });

    it('is true for an ancestor of the open node', () => {
        expect(isOnOpenPath(['a'], ['a', 'b'])).toBe(true);
    });

    it('is false for a sibling of the open node', () => {
        expect(isOnOpenPath(['a', 'c'], ['a', 'b'])).toBe(false);
    });

    it('is false for a descendant of the open node', () => {
        expect(isOnOpenPath(['a', 'b', 'c'], ['a', 'b'])).toBe(false);
    });

    it('is false for an unrelated top-level node', () => {
        expect(isOnOpenPath(['z'], ['a', 'b'])).toBe(false);
    });
});

describe('pickAdvanceCandidate', () => {
    function makeEls(count: number): HTMLElement[] {
        const els: HTMLElement[] = [];
        for (let i = 0; i < count; i++) {
            const el = document.createElement('div');
            document.body.appendChild(el);
            els.push(el);
        }
        return els;
    }

    afterEach(() => {
        document.body.innerHTML = '';
    });

    it('returns null when there are no candidates', () => {
        expect(pickAdvanceCandidate([], null)).toBeNull();
    });

    it('picks the earliest candidate in document order when nothing is open yet', () => {
        const [first, second] = makeEls(2);
        const result = pickAdvanceCandidate(
            [
                { path: ['b'], el: second! },
                { path: ['a'], el: first! },
            ],
            null,
        );
        expect(result?.path).toEqual(['a']);
    });

    it('ignores candidates at or before the currently open element', () => {
        // makeEls appends in creation order, so destructuring order IS document order here -
        // before/openEl/after are genuinely in that sequence in the DOM.
        const [before, openEl, after] = makeEls(3);
        const result = pickAdvanceCandidate(
            [
                { path: ['before'], el: before! },
                { path: ['open'], el: openEl! },
                { path: ['after'], el: after! },
            ],
            openEl!,
        );
        expect(result?.path).toEqual(['after']);
    });

    it('returns null when every candidate is at or before the currently open element', () => {
        const [before, openEl] = makeEls(2);
        const result = pickAdvanceCandidate([{ path: ['before'], el: before! }], openEl!);
        expect(result).toBeNull();
    });

    it('picks the earliest of several candidates that all follow the open element', () => {
        const els = makeEls(4);
        const openEl = els[0]!;
        const second = els[2]!;
        const third = els[3]!;
        const result = pickAdvanceCandidate(
            [
                { path: ['third'], el: third },
                { path: ['second'], el: second },
            ],
            openEl,
        );
        expect(result?.path).toEqual(['second']);
    });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/common/timeline_accordion.test.ts`
Expected: FAIL — `Cannot find module './timeline_accordion'`.

- [ ] **Step 3: Write the implementation**

```ts
// src/components/common/timeline_accordion.ts

// A collapsible node's identity in the shared accordion: [entryId] for a TimelineEntry, or
// [entryId, rowId] for a nested TimelineRow.
export type NodePath = string[];

export function pathKey(path: NodePath): string {
    return JSON.stringify(path);
}

// True when `path` is on the currently open path - either the open node itself, or one of its
// ancestors. A branch entry (one with nested rows) needs this to stay "revealed" (structurally
// expanded) while one of its own rows is the actual open leaf, since the row can't be visible at
// all unless its parent's own grid-template-rows wrapper is expanded.
export function isOnOpenPath(path: NodePath, openPath: NodePath | null): boolean {
    if (!openPath || path.length > openPath.length) return false;
    return path.every((segment, i) => segment === openPath[i]);
}

export interface AccordionCandidate {
    path: NodePath;
    el: Element;
}

// Among the candidates that entered the accordion band on this observer tick, pick the single
// node to advance the open pointer to: the earliest one in document order that comes after
// `openEl` (or, if nothing is open yet, the earliest of all candidates). Returns null when no
// candidate qualifies - every candidate is at or before the currently open node, which is exactly
// what keeps scrolling back up from reopening anything already passed.
export function pickAdvanceCandidate(
    candidates: AccordionCandidate[],
    openEl: Element | null,
): AccordionCandidate | null {
    let best: AccordionCandidate | null = null;
    for (const candidate of candidates) {
        if (openEl) {
            const relation = openEl.compareDocumentPosition(candidate.el);
            const follows = Boolean(relation & Node.DOCUMENT_POSITION_FOLLOWING);
            if (!follows) continue;
        }
        if (!best) {
            best = candidate;
            continue;
        }
        const relation = best.el.compareDocumentPosition(candidate.el);
        const candidatePrecedesBest = Boolean(relation & Node.DOCUMENT_POSITION_PRECEDING);
        if (candidatePrecedesBest) best = candidate;
    }
    return best;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/components/common/timeline_accordion.test.ts`
Expected: PASS (all cases).

- [ ] **Step 5: Commit**

```bash
git add src/components/common/timeline_accordion.ts src/components/common/timeline_accordion.test.ts
git commit -m "feat: add pure accordion path/ordering helpers for the timeline"
```

---

### Task 2: Shared accordion state on `Timeline` + the `useTimelineNode` hook

**Files:**
- Modify: `src/test-utils/mock-intersection-observer.ts`
- Modify: `src/components/common/timeline.tsx:1-14` (imports, `TimelineCtx`, `TimelineContext`, new
  `EntryIdContext`, root-margin constants) and `:16-77` (the `Timeline` component) — `TimelineEntry`
  (lines 79-144) is untouched in this task, see Task 3.
- Create: `src/components/common/use_timeline_node.ts`
- Test: `src/components/common/use_timeline_node.test.tsx`

**Interfaces:**
- Consumes: `NodePath`, `pathKey`, `isOnOpenPath`, `AccordionCandidate`, `pickAdvanceCandidate` from
  Task 1's `timeline_accordion.ts`.
- Produces: `Timeline`'s context gains `openPath: NodePath | null`,
  `registerNode: (path: NodePath, el: HTMLElement) => void`,
  `unregisterNode: (path: NodePath) => void` (alongside the existing `activeId`/`register`/
  `unregister`, unchanged). `export const TimelineContext` (now exported, was module-private).
  `export const EntryIdContext = createContext<string | null>(null)`.
  `export const ACTIVE_ID_ROOT_MARGIN` / `export const ACCORDION_ROOT_MARGIN` (string constants).
  `useTimelineNode(path: NodePath, ref: RefObject<HTMLElement | null>): { revealed: boolean; togglePin: () => void }`
  — consumed by Task 3 (`TimelineEntry`) and Task 4 (`TimelineRow`).

- [ ] **Step 1: Teach the `IntersectionObserver` test double to capture its constructor options**

`Timeline` is about to construct a second `IntersectionObserver` (the accordion band) alongside its
existing `activeId` one, with a different `rootMargin`. Tests need to tell them apart by the
options each was constructed with, not just by which elements they observe (both observers will
often observe the same elements). Edit `src/test-utils/mock-intersection-observer.ts`:

```ts
// src/test-utils/mock-intersection-observer.ts
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
```

This is a backward-compatible addition (`options` is a new optional field) — no existing test
using this helper needs to change for this step alone.

- [ ] **Step 2: Write the failing test for `useTimelineNode`**

```ts
// src/components/common/use_timeline_node.test.tsx
import { afterEach, describe, expect, it, vi } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { ReactNode } from 'react';
import { mockIntersectionObserver, ObserverInstance } from '../../test-utils/mock-intersection-observer';
import { ACCORDION_ROOT_MARGIN, Timeline } from './timeline';
import { useTimelineNode } from './use_timeline_node';

function wrapper({ children }: { children: ReactNode }) {
    return <Timeline>{children}</Timeline>;
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
    it('throws when used outside a Timeline', () => {
        const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
        const ref = makeRef();

        expect(() => renderHook(() => useTimelineNode(['a'], ref))).toThrow(
            'useTimelineNode must be used within a Timeline',
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
```

- [ ] **Step 3: Run test to verify it fails**

Run: `npx vitest run src/components/common/use_timeline_node.test.tsx`
Expected: FAIL — `Cannot find module './use_timeline_node'` and `ACCORDION_ROOT_MARGIN`/`EntryIdContext` not exported from `./timeline`.

- [ ] **Step 4: Extend `Timeline`/`TimelineCtx` with the accordion registry**

Replace the top of `src/components/common/timeline.tsx` (lines 1-14) with:

```tsx
import { createContext, FC, ReactNode, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import ChevronToggleButton from './chevron_toggle_button';
import { useScrollFade } from './use_scroll_fade';
import { AccordionCandidate, isOnOpenPath, NodePath, pathKey, pickAdvanceCandidate } from './timeline_accordion';

interface TimelineCtx {
    activeId: string | null;
    register: (id: string, el: HTMLElement) => void;
    unregister: (id: string) => void;
    openPath: NodePath | null;
    registerNode: (path: NodePath, el: HTMLElement) => void;
    unregisterNode: (path: NodePath) => void;
}

export const TimelineContext = createContext<TimelineCtx | null>(null);

// Provided by TimelineEntry (see Task 3) so a nested TimelineRow can build its own accordion path
// ([entryId, rowId]) without the entry id being threaded through TimelineRail as a prop.
export const EntryIdContext = createContext<string | null>(null);

// Mirrors useActiveSection's bias toward the top of the viewport (below the sticky nav) - drives
// which entry's marker is highlighted as "active". Bidirectional (updates on scroll in either
// direction), independent of the one-directional accordion below.
export const ACTIVE_ID_ROOT_MARGIN = '-96px 0px -70% 0px';
// A thinner band just under the nav - the point at which a node counts as "reached" for the
// scroll-driven accordion. Deliberately a separate observer/margin from ACTIVE_ID_ROOT_MARGIN, per
// docs/superpowers/specs/2026-07-30-timeline-scroll-accordion-design.md's Non-goals, so "where am
// I" (activeId) and "what's open" (the accordion) can never be tuned as if they were one concern.
export const ACCORDION_ROOT_MARGIN = '-96px 0px -85% 0px';
```

Then replace the `Timeline` component (lines 16-77) with:

```tsx
export const Timeline: FC<{ children: ReactNode; className?: string }> = ({ children, className = '' }) => {
    const [activeId, setActiveId] = useState<string | null>(null);
    const [openPath, setOpenPath] = useState<NodePath | null>(null);
    const elementsRef = useRef(new Map<string, HTMLElement>());
    const nodeElementsRef = useRef(new Map<string, AccordionCandidate>());
    const openPathRef = useRef<NodePath | null>(null);
    openPathRef.current = openPath;
    const hasScrolledRef = useRef(false);

    const observerRef = useRef<IntersectionObserver | null>(null);
    const accordionObserverRef = useRef<IntersectionObserver | null>(null);

    // Created lazily rather than in a useState initializer (which would run during the server
    // render, where IntersectionObserver doesn't exist and `next build`'s static export would
    // throw) and not in a useEffect either: a child's registration effect runs *before* this
    // parent's effects on initial mount, so both observers must be creatable on demand from
    // register()/registerNode() rather than assuming a Timeline effect has already run.
    const getObserver = useCallback((): IntersectionObserver => {
        observerRef.current ??= new IntersectionObserver(
            (entries) => {
                const visible = entries
                    .filter((entry) => entry.isIntersecting)
                    .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
                const topEntry = visible[0];
                if (!topEntry) return;
                for (const [id, el] of elementsRef.current) {
                    if (el === topEntry.target) {
                        setActiveId(id);
                        return;
                    }
                }
            },
            { rootMargin: ACTIVE_ID_ROOT_MARGIN, threshold: 0 },
        );
        return observerRef.current;
    }, []);

    const getAccordionObserver = useCallback((): IntersectionObserver => {
        accordionObserverRef.current ??= new IntersectionObserver(
            (entries) => {
                // Ignore the observer's own synchronous initial callback on observe() (which
                // fires even without a user scroll) - nothing may open until a real scroll/resize
                // has happened, so a node already sitting in the band on mount (a deep link, or a
                // page reload mid-scroll) still starts collapsed.
                if (!hasScrolledRef.current) return;
                const candidates: AccordionCandidate[] = [];
                for (const entry of entries) {
                    if (!entry.isIntersecting) continue;
                    for (const node of nodeElementsRef.current.values()) {
                        if (node.el === entry.target) {
                            candidates.push(node);
                            break;
                        }
                    }
                }
                if (candidates.length === 0) return;
                const currentOpenEl = openPathRef.current
                    ? (nodeElementsRef.current.get(pathKey(openPathRef.current))?.el ?? null)
                    : null;
                const advance = pickAdvanceCandidate(candidates, currentOpenEl);
                if (advance) setOpenPath(advance.path);
            },
            { rootMargin: ACCORDION_ROOT_MARGIN, threshold: 0 },
        );
        return accordionObserverRef.current;
    }, []);

    useEffect(() => {
        const markScrolled = () => {
            hasScrolledRef.current = true;
        };
        window.addEventListener('scroll', markScrolled, { passive: true });
        window.addEventListener('resize', markScrolled);
        return () => {
            window.removeEventListener('scroll', markScrolled);
            window.removeEventListener('resize', markScrolled);
        };
    }, []);

    useEffect(
        () => () => {
            observerRef.current?.disconnect();
            accordionObserverRef.current?.disconnect();
        },
        [],
    );

    const register = useCallback(
        (id: string, el: HTMLElement) => {
            elementsRef.current.set(id, el);
            getObserver().observe(el);
        },
        [getObserver],
    );
    const unregister = useCallback(
        (id: string) => {
            const el = elementsRef.current.get(id);
            if (el) getObserver().unobserve(el);
            elementsRef.current.delete(id);
        },
        [getObserver],
    );

    const registerNode = useCallback(
        (path: NodePath, el: HTMLElement) => {
            nodeElementsRef.current.set(pathKey(path), { path, el });
            getAccordionObserver().observe(el);
        },
        [getAccordionObserver],
    );
    const unregisterNode = useCallback(
        (path: NodePath) => {
            const key = pathKey(path);
            const node = nodeElementsRef.current.get(key);
            if (node) getAccordionObserver().unobserve(node.el);
            nodeElementsRef.current.delete(key);
            // If the removed node was the open node or an ancestor of it, its subtree can no
            // longer be shown - a later node re-entering the band picks the next open node.
            setOpenPath((current) => (current && isOnOpenPath(path, current) ? null : current));
        },
        [getAccordionObserver],
    );

    const contextValue = useMemo<TimelineCtx>(
        () => ({ activeId, register, unregister, openPath, registerNode, unregisterNode }),
        [activeId, register, unregister, openPath, registerNode, unregisterNode],
    );

    return (
        <div className={`relative pl-14 ${className}`}>
            <div className="bg-app-border absolute inset-y-1 left-[1.15rem] w-[2px]" aria-hidden="true" />
            <TimelineContext.Provider value={contextValue}>{children}</TimelineContext.Provider>
        </div>
    );
};
```

Leave `TimelineEntry` (currently lines 79-144) completely unchanged in this task — it still calls
`useScrollFade` exactly as before. It will not use the new registry yet; that's Task 3.

- [ ] **Step 5: Write `useTimelineNode`**

```ts
// src/components/common/use_timeline_node.ts
import { RefObject, useContext, useEffect, useState } from 'react';
import { TimelineContext } from './timeline';
import { isOnOpenPath, NodePath, pathKey } from './timeline_accordion';

export interface UseTimelineNodeControls {
    // Whether the caller should render this node at its natural height/opacity: true while it's
    // on the shared Timeline accordion's open path (itself or an ancestor of the actual open leaf
    // node), until a chevron click hands permanent, independent ownership to a manual pin.
    revealed: boolean;
    // Toggles based on the node's *current* visible state (`revealed`), not a separate pinned
    // flag - so clicking a chevron on content that's already open (whether via the accordion or
    // an earlier pin) closes it on that very first click. The first call also hands this node's
    // revealed state over to the pin permanently - every toggle after that is a real, independent
    // open/close, unaffected by where the accordion pointer goes from then on.
    togglePin: () => void;
}

// Registers `ref`'s element with the shared Timeline accordion under `path` ([entryId] for a
// TimelineEntry, [entryId, rowId] for a nested TimelineRow), and drives that node's open/closed
// state - see docs/superpowers/specs/2026-07-30-timeline-scroll-accordion-design.md. `ref` must be
// the node's own always-full-height root (marker/header/chevron never collapse), never a wrapper
// that's itself clipped to zero size while collapsed - such an element could never report
// intersecting, and could never trigger its own reveal.
export function useTimelineNode(path: NodePath, ref: RefObject<HTMLElement | null>): UseTimelineNodeControls {
    const ctx = useContext(TimelineContext);
    if (!ctx) throw new Error('useTimelineNode must be used within a Timeline');
    const { registerNode, unregisterNode, openPath } = ctx;

    const [hasBeenToggled, setHasBeenToggled] = useState(false);
    const [manuallyPinned, setManuallyPinned] = useState(false);

    const pathDepKey = pathKey(path);
    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        registerNode(path, el);
        return () => unregisterNode(path);
        // path is represented below by pathDepKey (a stable string), not the array itself - a
        // fresh array literal each render would otherwise tear the registration down and rebuild
        // it on every re-render. (No eslint-disable needed here - this repo doesn't have
        // eslint-plugin-react-hooks configured.)
    }, [pathDepKey, ref, registerNode, unregisterNode]);

    const onOpenPath = isOnOpenPath(path, openPath);
    const revealed = hasBeenToggled ? manuallyPinned : onOpenPath;

    const togglePin = () => {
        setHasBeenToggled(true);
        setManuallyPinned(!revealed);
    };

    return { revealed, togglePin };
}
```

- [ ] **Step 6: Run test to verify it passes**

Run: `npx vitest run src/components/common/use_timeline_node.test.tsx src/components/common/timeline.test.tsx`
Expected: `use_timeline_node.test.tsx` PASSES. `timeline.test.tsx` still passes unchanged too, since
`TimelineEntry` wasn't touched.

- [ ] **Step 7: Commit**

```bash
git add src/test-utils/mock-intersection-observer.ts src/components/common/timeline.tsx src/components/common/use_timeline_node.ts src/components/common/use_timeline_node.test.tsx
git commit -m "feat: add shared Timeline accordion registry and useTimelineNode hook"
```

---

### Task 3: Wire `TimelineEntry` into the accordion

**Files:**
- Modify: `src/components/common/timeline.tsx:79-144` (the `TimelineEntry` component)
- Modify: `src/components/common/timeline.test.tsx`

**Interfaces:**
- Consumes: `useTimelineNode` (Task 2), `EntryIdContext`/`ACTIVE_ID_ROOT_MARGIN`/`ACCORDION_ROOT_MARGIN` (Task 2, all exported from `./timeline`).
- Produces: no change to `TimelineEntry`'s own public props.

- [ ] **Step 1: Update `TimelineEntry`**

Replace the `TimelineEntry` component (`timeline.tsx`, currently lines 79-144) with:

```tsx
export const TimelineEntry: FC<{
    id: string;
    icon: { src: string; alt: string };
    // Always visible, never collapsed - the entry's title/place/period, rendered as a permanent
    // sibling next to the marker and chevron so it always has real height (giving consecutive
    // entries' markers room to breathe) and is legible before any scroll/chevron interaction.
    header: ReactNode;
    children: ReactNode;
    className?: string;
}> = ({ id, icon, header, children, className = '' }) => {
    const ctx = useContext(TimelineContext);
    if (!ctx) throw new Error('TimelineEntry must be used within a Timeline');
    const { register, unregister } = ctx;
    const ref = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    // Registers this entry's own always-full-height root (never contentRef, which is clipped to
    // zero visible size by its own grid-rows-[0fr] collapse) with the shared accordion.
    const { togglePin, revealed } = useTimelineNode([id], ref);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        register(id, el);
        return () => unregister(id);
    }, [id, register, unregister]);

    const isActive = ctx.activeId === id;

    return (
        <div ref={ref} data-timeline-entry={id} className={`relative pb-5 last:pb-0 ${className}`}>
            <button
                type="button"
                aria-label={icon.alt}
                aria-current={isActive ? 'true' : undefined}
                onClick={() => ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                className={`bg-app-surface absolute top-0 -left-14 size-9 overflow-hidden rounded-full border-2 transition-colors ${
                    isActive ? 'border-app-accent shadow-[0_0_0_3px_var(--app-accent-subtle)]' : 'border-app-border'
                }`}
            >
                <img src={icon.src} alt="" className="size-full object-cover" />
            </button>
            <ChevronToggleButton open={revealed} onToggle={togglePin} className="absolute top-0 right-0 z-10" />
            <div className="pr-8 pl-2">{header}</div>
            {/* Height and opacity both animate off the same discrete `revealed` boolean - no
                per-frame position math anymore (see use_timeline_node.ts) - so there's no residual
                same-frame-simultaneity risk to accept here either. motion-reduce: disables both
                transitions outright. */}
            <div
                className={`grid transition-[grid-template-rows,opacity] duration-200 ease-out motion-reduce:transition-none ${revealed ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
            >
                <div className="overflow-hidden">
                    <div ref={contentRef} data-timeline-content={id} className="pr-8 pl-2">
                        <EntryIdContext.Provider value={id}>{children}</EntryIdContext.Provider>
                    </div>
                </div>
            </div>
        </div>
    );
};
```

Also delete the now-unused `useScrollFade` import at the top of `timeline.tsx` and add
`useTimelineNode`'s import:

```tsx
import { useTimelineNode } from './use_timeline_node';
```

(Remove `import { useScrollFade } from './use_scroll_fade';`.)

- [ ] **Step 2: Update `timeline.test.tsx`**

Add the new imports at the top:

```tsx
import { ACCORDION_ROOT_MARGIN, ACTIVE_ID_ROOT_MARGIN, Timeline, TimelineEntry } from './timeline';
```

(Replace the existing `import { Timeline, TimelineEntry } from './timeline';` line.)

Replace the `'observes an entry that registers before the Timeline runs any effect of its own'` test:

```tsx
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
```

Replace the `'marks the topmost intersecting entry as active'` test's observer lookup:

```tsx
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
```

Replace the `'does not re-run a sibling entry registration effect when only the active entry changes'` test similarly (rename `timelineObserver` to `activeIdObserver`, look it up the same way):

```tsx
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
```

Replace `'scroll-fades each entry's content independently, leaving its marker always fully visible'`:

```tsx
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
```

Replace `'renders its own chevron outside the faded content, so it stays visible and clickable while content is collapsed'`:

```tsx
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
```

Replace `'animates the grid-row height transition, disabled under prefers-reduced-motion'`:

```tsx
it('animates the grid-row height and opacity transition, disabled under prefers-reduced-motion', () => {
    mockIntersectionObserver();
    renderTwoEntries();

    const content = screen.getByText('Entry A').closest('[data-timeline-content]') as HTMLElement;
    const gridWrapper = content.parentElement!.parentElement!;

    expect(gridWrapper).toHaveClass(
        'transition-[grid-template-rows,opacity]',
        'duration-200',
        'ease-out',
        'motion-reduce:transition-none',
    );
});
```

`'renders every entry, none active before any intersection is reported'`,
`'smooth-scrolls to the entry when its marker is clicked'`,
`'renders header outside the faded content, so it stays fully visible while content is collapsed'`,
`'collapses the content to near-zero height while hidden, expanding once the chevron reveals it'`,
and `'throws when a TimelineEntry is rendered outside a Timeline'` are all unchanged — leave them
as-is.

Finally, add a new `describe` block at the end of the file (before the closing of the outer
`describe('Timeline / TimelineEntry', ...)`):

```tsx
describe('scroll accordion', () => {
    it('opens the entry the accordion band reaches, and closes it again once a later entry is reached', () => {
        const { instances } = mockIntersectionObserver();
        renderTwoEntries();

        const entryA = screen.getByText('Entry A').closest('[data-timeline-entry]') as HTMLElement;
        const entryB = screen.getByText('Entry B').closest('[data-timeline-entry]') as HTMLElement;
        const accordion = instances.find((i) => i.options?.rootMargin === ACCORDION_ROOT_MARGIN)!;
        const contentA = screen.getByText('Entry A').closest('[data-timeline-content]')!.parentElement!.parentElement!;
        const contentB = screen.getByText('Entry B').closest('[data-timeline-content]')!.parentElement!.parentElement!;

        act(() => {
            window.dispatchEvent(new Event('scroll'));
            accordion.trigger([{ isIntersecting: true, target: entryA }]);
        });
        expect(contentA).toHaveClass('grid-rows-[1fr]');
        expect(contentB).toHaveClass('grid-rows-[0fr]');

        act(() => {
            accordion.trigger([{ isIntersecting: true, target: entryB }]);
        });
        expect(contentA).toHaveClass('grid-rows-[0fr]');
        expect(contentB).toHaveClass('grid-rows-[1fr]');
    });

    it('does not open anything from the band before a real scroll/resize has happened', () => {
        const { instances } = mockIntersectionObserver();
        renderTwoEntries();

        const entryA = screen.getByText('Entry A').closest('[data-timeline-entry]') as HTMLElement;
        const accordion = instances.find((i) => i.options?.rootMargin === ACCORDION_ROOT_MARGIN)!;
        const contentA = screen.getByText('Entry A').closest('[data-timeline-content]')!.parentElement!.parentElement!;

        act(() => {
            accordion.trigger([{ isIntersecting: true, target: entryA }]);
        });

        expect(contentA).toHaveClass('grid-rows-[0fr]');
    });

    it('does not reopen an entry already passed when its band re-triggers (e.g. scrolling back up)', () => {
        const { instances } = mockIntersectionObserver();
        renderTwoEntries();

        const entryA = screen.getByText('Entry A').closest('[data-timeline-entry]') as HTMLElement;
        const entryB = screen.getByText('Entry B').closest('[data-timeline-entry]') as HTMLElement;
        const accordion = instances.find((i) => i.options?.rootMargin === ACCORDION_ROOT_MARGIN)!;
        const contentA = screen.getByText('Entry A').closest('[data-timeline-content]')!.parentElement!.parentElement!;

        act(() => {
            window.dispatchEvent(new Event('scroll'));
            accordion.trigger([{ isIntersecting: true, target: entryA }]);
            accordion.trigger([{ isIntersecting: true, target: entryB }]);
        });
        expect(contentA).toHaveClass('grid-rows-[0fr]');

        act(() => {
            accordion.trigger([{ isIntersecting: true, target: entryA }]);
        });
        expect(contentA).toHaveClass('grid-rows-[0fr]');
    });

    it('clears the open pointer when the open entry unmounts, letting an earlier entry reopen on its next band-trigger', () => {
        const { instances } = mockIntersectionObserver();

        function Harness() {
            const [showB, setShowB] = useState(true);
            return (
                <>
                    <button onClick={() => setShowB(false)}>remove B</button>
                    <Timeline>
                        <TimelineEntry id="a" icon={{ src: '/a.png', alt: 'A' }} header="Header A">
                            Entry A
                        </TimelineEntry>
                        {showB && (
                            <TimelineEntry id="b" icon={{ src: '/b.png', alt: 'B' }} header="Header B">
                                Entry B
                            </TimelineEntry>
                        )}
                    </Timeline>
                </>
            );
        }
        render(<Harness />);

        const entryA = screen.getByText('Entry A').closest('[data-timeline-entry]') as HTMLElement;
        const entryB = screen.getByText('Entry B').closest('[data-timeline-entry]') as HTMLElement;
        const accordion = instances.find((i) => i.options?.rootMargin === ACCORDION_ROOT_MARGIN)!;
        const contentA = screen.getByText('Entry A').closest('[data-timeline-content]')!.parentElement!.parentElement!;

        act(() => {
            window.dispatchEvent(new Event('scroll'));
            accordion.trigger([{ isIntersecting: true, target: entryA }]);
            accordion.trigger([{ isIntersecting: true, target: entryB }]);
        });
        expect(contentA).toHaveClass('grid-rows-[0fr]'); // A closed once B (later) took over

        act(() => {
            screen.getByRole('button', { name: 'remove B' }).click();
        });

        // If unregisterNode hadn't cleared openPath back to null, the stale reference to B's (now
        // detached) element would make every future candidate compare as "not later than the open
        // node" via compareDocumentPosition, and A could never reopen again.
        act(() => {
            accordion.trigger([{ isIntersecting: true, target: entryA }]);
        });
        expect(contentA).toHaveClass('grid-rows-[1fr]');
    });
});
```

This test needs `useState` added to the file's React import: `import { useState } from 'react';`.

- [ ] **Step 3: Run tests to verify they pass**

Run: `npx vitest run src/components/common/timeline.test.tsx`
Expected: PASS (all cases).

- [ ] **Step 4: Commit**

```bash
git add src/components/common/timeline.tsx src/components/common/timeline.test.tsx
git commit -m "feat: wire TimelineEntry into the shared scroll accordion"
```

---

### Task 4: Wire `TimelineRow` into the accordion

**Files:**
- Modify: `src/components/common/timeline_row.tsx`
- Modify: `src/components/common/timeline_row.test.tsx`
- Create: `src/test-utils/render-in-timeline-entry.tsx`

**Interfaces:**
- Consumes: `useTimelineNode`, `EntryIdContext` (from `./timeline`).
- Produces: `TimelineRow` gains a required `id: string` prop. Existing `header`/`children`/
  `className` props unchanged.

- [ ] **Step 1: Add the shared `renderInTimelineEntry` test helper**

`TimelineRow` will now require an `EntryIdContext` provider (i.e. a real `TimelineEntry` ancestor)
to render at all - every existing standalone `<TimelineRow>` test needs one. Add a helper mirroring
the existing `render-in-timeline.tsx`:

```tsx
// src/test-utils/render-in-timeline-entry.tsx
import { render } from '@testing-library/react';
import { ReactNode } from 'react';
import { Timeline, TimelineEntry } from '../components/common/timeline';

// Renders children inside a real Timeline > TimelineEntry, which TimelineRow/TimelineRail require
// as their EntryIdContext provider - a row's accordion path is [entryId, rowId], which has no
// meaning without a parent entry.
export function renderInTimelineEntry(children: ReactNode) {
    return render(
        <Timeline>
            <TimelineEntry id="entry" icon={{ src: '/icon.png', alt: 'icon' }} header="entry header">
                {children}
            </TimelineEntry>
        </Timeline>,
    );
}
```

- [ ] **Step 2: Update `TimelineRow`**

Replace `src/components/common/timeline_row.tsx` in full:

```tsx
import { FC, ReactNode, useContext, useRef } from 'react';
import ChevronToggleButton from './chevron_toggle_button';
import { EntryIdContext } from './timeline';
import { useTimelineNode } from './use_timeline_node';

// The nested rail inside a TimelineEntry: the vertical connecting line the child rows' dot
// markers sit on. `className` carries the caller's own spacing (e.g. 'space-y-7').
export const TimelineRail: FC<{ children: ReactNode; className?: string }> = ({ children, className = '' }) => (
    <div
        className={`before:bg-app-border relative mt-3 pl-6 before:absolute before:inset-y-2 before:left-[9px] before:w-[2px] before:content-[''] ${className}`}
    >
        {children}
    </div>
);

// A single row on a nested TimelineRail: part of the shared Timeline scroll accordion, with the
// small accent-coloured dot marker pinned to the rail and its own chevron to pin the row open/
// closed independently of the accordion. The dot marker, the chevron, and `header` all live
// outside the faded content, so they stay visible and clickable/legible as permanent elements even
// while the row's secondary content is collapsed by default.
export const TimelineRow: FC<{ id: string; header?: ReactNode; children?: ReactNode; className?: string }> = ({
    id,
    header,
    children,
    className = '',
}) => {
    const entryId = useContext(EntryIdContext);
    if (entryId === null) throw new Error('TimelineRow must be used within a TimelineEntry');
    const rowRef = useRef<HTMLDivElement>(null);
    // A row with no `children` has no collapsible content or chevron at all (see below) - it must
    // never occupy a slot in the shared accordion. useTimelineNode still has to be called
    // unconditionally (rules of hooks), so it's handed this permanently-empty ref instead of
    // rowRef in that case, which makes its registration effect's `if (!el) return` a no-op forever.
    const inertRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const { togglePin, revealed } = useTimelineNode([entryId, id], children ? rowRef : inertRef);
    return (
        <div
            ref={rowRef}
            data-timeline-row=""
            // The bare form ('scale-1.15') that this rule suggests compiles to no CSS at all:
            // Tailwind's scale utility only accepts whole-number bare values (e.g. 'scale-115'),
            // unlike this bracketed decimal.
            // eslint-disable-next-line tailwindcss/no-unnecessary-arbitrary-value
            className={`before:bg-app-accent before:border-app-surface relative before:absolute before:top-2 before:-left-5 before:size-3 before:rounded-full before:border-2 before:shadow-[0_0_0_1px_var(--app-accent)] before:transition-transform before:duration-200 before:content-[''] hover:before:scale-[1.15] ${className}`}
        >
            {header && <div className={children ? 'pr-8' : ''}>{header}</div>}
            {children && (
                <>
                    <ChevronToggleButton open={revealed} onToggle={togglePin} className="absolute top-1 right-1 z-10" />
                    <div
                        className={`grid transition-[grid-template-rows,opacity] duration-200 ease-out motion-reduce:transition-none ${revealed ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
                    >
                        <div className="overflow-hidden">
                            <div ref={contentRef} data-timeline-row-content="" className="pr-8">
                                {children}
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};
```

- [ ] **Step 3: Update `timeline_row.test.tsx`**

Replace the file's imports and setup:

```tsx
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mockIntersectionObserver } from '../../test-utils/mock-intersection-observer';
import { mockMatchMedia } from '../../test-utils/mock-match-media';
import { renderInTimelineEntry } from '../../test-utils/render-in-timeline-entry';
import { ACCORDION_ROOT_MARGIN, Timeline, TimelineEntry } from './timeline';
import { TimelineRail, TimelineRow } from './timeline_row';

beforeEach(() => {
    vi.stubGlobal('innerHeight', 800);
});

afterEach(() => {
    vi.unstubAllGlobals();
});
```

Every test that currently does `render(<TimelineRow ...>)` switches to
`renderInTimelineEntry(<TimelineRow id="r" ...>)` (add the now-required `id` prop). Concretely:

```tsx
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

    it('renders its chevron outside the faded content, so it stays visible and clickable while collapsed', async () => {
        mockIntersectionObserver();
        mockMatchMedia();
        renderInTimelineEntry(<TimelineRow id="r">row content</TimelineRow>);

        const content = screen.getByText('row content').closest('[data-timeline-row-content]') as HTMLElement;
        const gridWrapper = content.parentElement!.parentElement!;
        const chevron = screen.getByRole('button', { name: 'Expand' });

        expect(gridWrapper).toHaveClass('grid-rows-[0fr]', 'opacity-0');
        expect(chevron.style.opacity).toBe('');
        expect(chevron.closest('[data-timeline-row-content]')).toBeNull();

        expect(chevron).toHaveAttribute('aria-expanded', 'false');
        await userEvent.click(chevron);

        expect(gridWrapper).toHaveClass('grid-rows-[1fr]', 'opacity-100');
        expect(screen.getByRole('button', { name: 'Collapse' })).toHaveAttribute('aria-expanded', 'true');
    });

    it('collapses the content to near-zero height while hidden, expanding once the chevron reveals it', async () => {
        mockIntersectionObserver();
        mockMatchMedia();
        renderInTimelineEntry(<TimelineRow id="r">row content</TimelineRow>);

        const content = screen.getByText('row content').closest('[data-timeline-row-content]') as HTMLElement;
        const gridWrapper = content.parentElement!.parentElement!;
        expect(gridWrapper).toHaveClass('grid-rows-[0fr]');

        const chevron = screen.getByRole('button', { name: 'Expand' });
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
        const gridWrapper = content.parentElement!.parentElement!;
        const chevron = screen.getByRole('button', { name: 'Expand' });
        expect(chevron).toHaveAttribute('aria-expanded', 'false');
        expect(gridWrapper).toHaveClass('grid-rows-[0fr]');

        await userEvent.click(chevron);

        expect(gridWrapper).toHaveClass('grid-rows-[1fr]');
        expect(screen.getByRole('button', { name: 'Collapse' })).toHaveAttribute('aria-expanded', 'true');

        await userEvent.click(screen.getByRole('button', { name: 'Collapse' }));

        expect(screen.getByRole('button', { name: 'Expand' })).toHaveAttribute('aria-expanded', 'false');
        expect(gridWrapper).toHaveClass('grid-rows-[0fr]');
    });
});

describe('TimelineRow header', () => {
    it('renders header outside the faded content, always visible even before any scroll', () => {
        mockIntersectionObserver();
        mockMatchMedia();
        renderInTimelineEntry(<TimelineRow id="r" header="row header">row content</TimelineRow>);

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

        expect(screen.getByText('row header')).toBeInTheDocument();
        expect(screen.queryByRole('button', { name: 'Expand' })).not.toBeInTheDocument();
    });
});

describe('TimelineRail', () => {
    it('renders the connecting-line classes plus the caller-supplied spacing', () => {
        renderInTimelineEntry(<TimelineRail className="space-y-7">rail content</TimelineRail>);

        expect(screen.getByText('rail content')).toHaveClass('relative', 'before:bg-app-border', 'space-y-7');
    });
});
```

Then add a new describe block at the end of the file for the nested-under-a-real-Timeline
accordion behavior:

```tsx
describe('scroll accordion (nested under a real Timeline)', () => {
    function renderEntryWithRowAndSibling() {
        return render(
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
            </Timeline>,
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
```

This last block needs `render` from `@testing-library/react` too — add it to the top import:
`import { act, render, screen } from '@testing-library/react';`.

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run src/components/common/timeline_row.test.tsx`
Expected: PASS (all cases).

- [ ] **Step 5: Commit**

```bash
git add src/components/common/timeline_row.tsx src/components/common/timeline_row.test.tsx src/test-utils/render-in-timeline-entry.tsx
git commit -m "feat: wire TimelineRow into the shared scroll accordion"
```

---

### Task 5: Pass `id` from the real consumers

**Files:**
- Modify: `src/components/employments/employment_item.tsx:11-30`
- Modify: `src/components/licenses_certifications/license_certification_item.tsx:13-34`

**Interfaces:**
- Consumes: `TimelineRow`'s now-required `id: string` prop (Task 4).
- Produces: no change to either file's own exported component signature.

- [ ] **Step 1: Pass `id` in `employment_item.tsx`**

Replace `PositionRow` and its call site:

```tsx
const PositionRow: FC<{
    position: Position;
    display: ReturnType<typeof useDisplayPeriod>['display'];
    id: string;
}> = ({ position, display, id }) => (
    <TimelineRow
        id={id}
        header={
            <div className="mb-2 flex flex-col gap-1">
                <ItemTitle>{position.position}</ItemTitle>
                <div className="text-app-text-muted">
                    {display({
                        start: new Date(position.period.start),
                        end: position.period.end ? new Date(position.period.end) : undefined,
                    })}
                </div>
            </div>
        }
    >
        {position.description && <Markdown>{position.description}</Markdown>}
    </TimelineRow>
);
```

And its usage inside `EmploymentItem`:

```tsx
<TimelineRail className="space-y-7">
    {positions.map((position, posIdx) => (
        <PositionRow key={`${index}-${posIdx}`} id={String(posIdx)} position={position} display={display} />
    ))}
</TimelineRail>
```

- [ ] **Step 2: Pass `id` in `license_certification_item.tsx`**

Replace `CertificationRow` and its call site:

```tsx
const CertificationRow: FC<{ cert: Certification; monthYear: string; id: string }> = ({ cert, monthYear, id }) => (
    <TimelineRow id={id} header={<CertificationContent cert={cert} monthYear={monthYear} />} />
);
```

```tsx
<TimelineRail className="space-y-1">
    {certifications.map((cert, certIdx) => (
        <CertificationRow key={`${index}-${certIdx}`} id={String(certIdx)} cert={cert} monthYear={getMonthYear(cert.date)} />
    ))}
</TimelineRail>
```

- [ ] **Step 3: Run the existing consumer test suites to verify no regressions**

Run: `npx vitest run src/components/employments/employment_item.test.tsx src/components/licenses_certifications/license_certification_item.test.tsx src/components/education/education_item.test.tsx`
Expected: PASS, unchanged — none of these tests assert on `id`/opacity/accordion internals, only on
rendered text, chevron `aria-expanded`, and click behavior, all of which are preserved.

- [ ] **Step 4: Commit**

```bash
git add src/components/employments/employment_item.tsx src/components/licenses_certifications/license_certification_item.tsx
git commit -m "feat: pass row id from employment/license consumers into TimelineRow"
```

---

### Task 6: Strip `useScrollFade` down to what `Section` actually needs

**Files:**
- Modify: `src/components/common/use_scroll_fade.ts`
- Modify: `src/components/common/use_scroll_fade.test.ts`

**Interfaces:**
- Consumes: nothing new.
- Produces: `useScrollFade(ref: RefObject<HTMLElement | null>): void` (no more `options`,
  `gatingRef`, or return value). `Section` (`section.tsx`) calls it exactly as it already does
  (`useScrollFade(ref)`, discarding any return value) — no change needed to `section.tsx` itself.

- [ ] **Step 1: Replace `use_scroll_fade.ts`**

`TimelineEntry`/`TimelineRow` no longer call this hook (Tasks 3-4) — `Section` is its only
remaining caller, and `Section` only ever calls it with a single `ref` argument and ignores the
return value. Replace the file in full:

```ts
// src/components/common/use_scroll_fade.ts
import { RefObject, useEffect } from 'react';

// Fraction of viewport height the entry ramp spans (bottom of viewport upward).
const ENTRY_RATIO = 0.3;
// Fraction of viewport height the exit ramp spans (top of viewport downward).
const EXIT_RATIO = 0.2;
// Mirrors useActiveSection's -96px bias for the sticky nav's height, so an element only starts
// fading out once it's genuinely passing under the nav.
const NAV_OFFSET_PX = 96;

function clamp01(value: number): number {
    return Math.min(1, Math.max(0, value));
}

function computeOpacity(rect: { top: number; bottom: number }, viewportHeight: number): number {
    const entryStart = viewportHeight;
    const entryEnd = viewportHeight * (1 - ENTRY_RATIO);
    const entryProgress = clamp01((entryStart - rect.top) / (entryStart - entryEnd));

    const exitStart = NAV_OFFSET_PX + viewportHeight * EXIT_RATIO;
    const exitEnd = NAV_OFFSET_PX;
    const exitProgress = clamp01((rect.bottom - exitEnd) / (exitStart - exitEnd));

    return Math.min(entryProgress, exitProgress);
}

// Continuously fades an element's opacity in/out based on its position in the viewport. Used only
// by Section now - TimelineEntry/TimelineRow's collapsed-by-default, scroll-driven-accordion
// behavior lives in useTimelineNode instead (see
// docs/superpowers/specs/2026-07-30-timeline-scroll-accordion-design.md), which has no use for a
// continuous ramp.
export function useScrollFade(ref: RefObject<HTMLElement | null>): void {
    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (reducedMotion) {
            el.style.opacity = '1';
            return;
        }

        let frame: number | null = null;
        let scheduled = false;
        let gated = false;

        const recompute = () => {
            scheduled = false;
            frame = null;
            const rect = el.getBoundingClientRect();
            el.style.opacity = String(computeOpacity(rect, window.innerHeight));
        };

        const scheduleRecompute = () => {
            if (scheduled) return;
            scheduled = true;
            frame = requestAnimationFrame(recompute);
        };

        const observer = new IntersectionObserver(
            (entries) => {
                const isNear = entries.some((entry) => entry.isIntersecting);
                if (isNear && !gated) {
                    gated = true;
                    window.addEventListener('scroll', scheduleRecompute, { passive: true });
                    window.addEventListener('resize', scheduleRecompute);
                    scheduleRecompute();
                } else if (!isNear && gated) {
                    gated = false;
                    window.removeEventListener('scroll', scheduleRecompute);
                    window.removeEventListener('resize', scheduleRecompute);
                }
            },
            { rootMargin: '100% 0px 100% 0px', threshold: 0 },
        );
        observer.observe(el);
        recompute();

        return () => {
            observer.disconnect();
            if (frame !== null) cancelAnimationFrame(frame);
            window.removeEventListener('scroll', scheduleRecompute);
            window.removeEventListener('resize', scheduleRecompute);
        };
    }, [ref]);
}
```

- [ ] **Step 2: Replace `use_scroll_fade.test.ts`**

Drop every `collapsedOnMount`, `togglePin`, and `gatingRef` describe block, and drop
`result.current.revealed` assertions from the remaining cases (the hook no longer returns
anything). Replace the file in full:

```ts
// src/components/common/use_scroll_fade.test.ts
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
```

- [ ] **Step 3: Run tests to verify they pass**

Run: `npx vitest run src/components/common/use_scroll_fade.test.ts src/components/common/section.test.tsx`
Expected: PASS (both files, unchanged assertions for `section.test.tsx` since `Section` itself
needs no code change).

- [ ] **Step 4: Commit**

```bash
git add src/components/common/use_scroll_fade.ts src/components/common/use_scroll_fade.test.ts
git commit -m "refactor: strip useScrollFade down to Section's continuous-fade needs"
```

---

### Task 7: Full-suite verification

**Files:** none (verification only).

**Interfaces:** none.

- [ ] **Step 1: Type-check**

Run: `npx tsc --noEmit`
Expected: no errors. Then delete the generated `tsconfig.tsbuildinfo` (`rm tsconfig.tsbuildinfo` /
`Remove-Item tsconfig.tsbuildinfo`) — never commit it.

- [ ] **Step 2: Full test suite with coverage**

Run: `npm run coverage`
Expected: all suites pass, including `src/app.test.tsx` (if the "language switching" block flakes
under `--coverage`, re-run with `--retry=2` per the known pre-existing flakiness noted in
`CLAUDE.md` — don't loosen assertions to work around it).

- [ ] **Step 3: Manual check in the running app**

Start the dev server and open the page in a browser. Scroll down through the employment/education/
license timeline sections and confirm: everything starts collapsed; scrolling down opens entries
(and nested position/certification rows) one at a time, closing whatever was open before; scrolling
back up never reopens something already passed; a chevron click still opens/closes its own item
independently of scroll. Check both light and dark theme, and with the OS's reduced-motion setting
enabled (no transition, but still correct open/closed state).

- [ ] **Step 4: Final commit if any cleanup was needed**

If Steps 1-3 required any fixes, commit them separately with a clear message before considering
this plan complete.

