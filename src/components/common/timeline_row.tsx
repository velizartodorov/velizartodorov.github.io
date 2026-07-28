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
            data-timeline-row={id}
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
