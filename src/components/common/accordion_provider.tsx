import { createContext, FC, ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AccordionCandidate, isOnOpenPath, NodePath, pathKey, pickAdvanceCandidate } from './timeline_accordion';

interface AccordionCtx {
    openPath: NodePath | null;
    registerNode: (path: NodePath, el: HTMLElement) => void;
    unregisterNode: (path: NodePath) => void;
}

export const AccordionContext = createContext<AccordionCtx | null>(null);

// A thin band just under the nav - the point at which a node counts as "reached" for the
// scroll-driven accordion. Separate from Timeline's own ACTIVE_ID_ROOT_MARGIN/activeId scrollspy -
// see docs/superpowers/specs/2026-07-30-timeline-scroll-accordion-design.md's Non-goals: "where am
// I" (per-section, bidirectional) and "what's open" (page-wide, one-directional) are deliberately
// separate concerns with separate observers.
export const ACCORDION_ROOT_MARGIN = '-96px 0px -85% 0px';

// Wraps every section that contains a Timeline (Employments, Licenses & certifications, Education)
// so the scroll-driven accordion's "exactly one open item" pool is shared across the whole page,
// not scoped to whichever Timeline instance a TimelineEntry/TimelineRow happens to be inside.
// Timeline's own activeId scrollspy is unaffected - each Timeline still tracks its own
// nearest-to-top marker independently, since that was never meant to be page-wide (see
// ACTIVE_ID_ROOT_MARGIN's doc comment in timeline.tsx).
export const AccordionProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const [openPath, setOpenPath] = useState<NodePath | null>(null);
    const nodeElementsRef = useRef(new Map<string, AccordionCandidate>());
    const openPathRef = useRef<NodePath | null>(null);
    openPathRef.current = openPath;
    const hasScrolledRef = useRef(false);
    const observerRef = useRef<IntersectionObserver | null>(null);

    // Created lazily rather than in a useState initializer or effect - a descendant's
    // registration effect can run before this provider's own effects.
    const getObserver = useCallback((): IntersectionObserver => {
        observerRef.current ??= new IntersectionObserver(
            (entries) => {
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
        return observerRef.current;
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

    useEffect(() => () => observerRef.current?.disconnect(), []);

    const registerNode = useCallback(
        (path: NodePath, el: HTMLElement) => {
            nodeElementsRef.current.set(pathKey(path), { path, el });
            getObserver().observe(el);
        },
        [getObserver],
    );
    const unregisterNode = useCallback(
        (path: NodePath) => {
            const key = pathKey(path);
            const node = nodeElementsRef.current.get(key);
            if (node) getObserver().unobserve(node.el);
            nodeElementsRef.current.delete(key);
            setOpenPath((current) => (current && isOnOpenPath(path, current) ? null : current));
        },
        [getObserver],
    );

    const contextValue = useMemo<AccordionCtx>(
        () => ({ openPath, registerNode, unregisterNode }),
        [openPath, registerNode, unregisterNode],
    );

    return <AccordionContext.Provider value={contextValue}>{children}</AccordionContext.Provider>;
};
