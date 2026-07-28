import { createContext, FC, ReactNode, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import ChevronToggleButton from './chevron_toggle_button';
import { useTimelineNode } from './use_timeline_node';

interface TimelineCtx {
    activeId: string | null;
    register: (id: string, el: HTMLElement) => void;
    unregister: (id: string) => void;
}

export const TimelineContext = createContext<TimelineCtx | null>(null);

// Provided by TimelineEntry so a nested TimelineRow can build its own accordion path
// ([entryId, rowId]) without the entry id being threaded through TimelineRail as a prop.
export const EntryIdContext = createContext<string | null>(null);

// Mirrors useActiveSection's bias toward the top of the viewport (below the sticky nav) - drives
// which entry's marker is highlighted as "active" within THIS Timeline instance. Bidirectional
// (updates on scroll in either direction) and per-section, independent of the page-wide,
// one-directional accordion in accordion_provider.tsx.
export const ACTIVE_ID_ROOT_MARGIN = '-96px 0px -70% 0px';

export const Timeline: FC<{ children: ReactNode; className?: string }> = ({ children, className = '' }) => {
    const [activeId, setActiveId] = useState<string | null>(null);
    const elementsRef = useRef(new Map<string, HTMLElement>());
    const observerRef = useRef<IntersectionObserver | null>(null);

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

    useEffect(() => () => observerRef.current?.disconnect(), []);

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

    const contextValue = useMemo<TimelineCtx>(
        () => ({ activeId, register, unregister }),
        [activeId, register, unregister],
    );

    return (
        <div className={`relative pl-14 ${className}`}>
            <div className="bg-app-border absolute inset-y-1 left-[1.15rem] w-[2px]" aria-hidden="true" />
            <TimelineContext.Provider value={contextValue}>{children}</TimelineContext.Provider>
        </div>
    );
};

export const TimelineEntry: FC<{
    id: string;
    icon: { src: string; alt: string };
    // Always visible, never collapsed - the entry's title/place/period, rendered as a permanent
    // sibling next to the marker and chevron so it always has real height (giving consecutive
    // entries' markers room to breathe) and is legible before any scroll/chevron interaction.
    header: ReactNode;
    // An entry with no children has no collapsible content, so it renders no chevron at all (see
    // below) and never occupies a slot in the shared accordion - same reasoning as TimelineRow's
    // childless case.
    children?: ReactNode;
    className?: string;
}> = ({ id, icon, header, children, className = '' }) => {
    const ctx = useContext(TimelineContext);
    if (!ctx) throw new Error('TimelineEntry must be used within a Timeline');
    const { register, unregister } = ctx;
    const ref = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    // A childless entry is handed this permanently-empty ref instead of ref, so its registration
    // effect's `if (!el) return` is a no-op forever and it never joins the pin accordion.
    const inertRef = useRef<HTMLDivElement>(null);
    // Registers this entry's own always-full-height root (never contentRef, which is clipped to
    // zero visible size by its own grid-rows-[0fr] collapse) with the shared, page-wide accordion.
    const { togglePin, revealed } = useTimelineNode([id], children ? ref : inertRef);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        register(id, el);
        return () => unregister(id);
    }, [id, register, unregister]);

    const isActive = ctx.activeId === id;

    return (
        <div ref={ref} data-timeline-entry={id} className={`relative pb-1.5 last:pb-0 ${className}`}>
            {/* Its own relative wrapper (header only, not content) so the marker below centers on
                the header's height specifically, regardless of whether content is expanded. */}
            <div className="relative">
                <button
                    type="button"
                    aria-label={icon.alt}
                    aria-current={isActive ? 'true' : undefined}
                    onClick={() => ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                    className={`bg-app-surface-alt absolute top-1/2 -left-14 size-9 -translate-y-1/2 overflow-hidden rounded-full border-2 transition-colors ${
                        isActive ? 'border-app-accent shadow-[0_0_0_3px_var(--app-accent-subtle)]' : 'border-app-border'
                    }`}
                >
                    <img src={icon.src} alt="" className="size-full object-cover" />
                </button>
                {/* pr-8 below always reserves the chevron's space, whether or not this entry has
                    one, so title/place/period columns stay aligned with sibling entries that do.
                    rounded-t-lg (not rounded-lg) only while the body below is actually revealed -
                    collapsed, there's no visible box beneath it to justify a flat bottom edge. */}
                <div
                    onClick={children ? togglePin : undefined}
                    onKeyDown={
                        children
                            ? (e) => {
                                  if (e.key !== 'Enter' && e.key !== ' ') return;
                                  e.preventDefault();
                                  togglePin();
                              }
                            : undefined
                    }
                    role={children ? 'button' : undefined}
                    tabIndex={children ? 0 : undefined}
                    aria-expanded={children ? revealed : undefined}
                    className={`relative py-2 pr-8 pl-3 transition-[filter,border-radius] duration-300 ${children ? 'bg-app-surface-alt border-app-border cursor-pointer border hover:brightness-95 dark:hover:brightness-125' : ''} ${children && revealed ? 'rounded-t-lg' : 'rounded-lg'}`}
                >
                    {header}
                    {children && (
                        <ChevronToggleButton
                            open={revealed}
                            onToggle={togglePin}
                            className="absolute top-1/2 right-2 z-10 -translate-y-1/2"
                        />
                    )}
                </div>
            </div>
            {children && (
                <div
                    className={`grid transition-[grid-template-rows,opacity] duration-[550ms] ease-in-out motion-reduce:transition-none ${revealed ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
                >
                    <div className="overflow-hidden">
                        <div
                            ref={contentRef}
                            data-timeline-content={id}
                            className="bg-app-surface border-app-border [&::-webkit-scrollbar-thumb]:bg-app-border [&::-webkit-scrollbar-thumb:hover]:bg-app-text-muted max-h-96 [scrollbar-width:thin] [scrollbar-color:var(--app-border)_transparent] overflow-y-auto rounded-b-lg border border-t-0 p-2 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent"
                        >
                            <EntryIdContext.Provider value={id}>{children}</EntryIdContext.Provider>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
