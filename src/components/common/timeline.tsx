import { Children, FC, isValidElement, ReactNode, useContext, useMemo } from 'react';
import { CollapsibleRegion } from './collapsible_region';
import { EntryHeader } from './entry_header';
import { RailSegment, railClasses } from './rail_segment';
import { EntryIdContext, InTimelineContext, RailNodeContext } from './timeline_context';
import { useTimelineRegistration } from './timeline_active';
import { IconSpec, TimelineMarker } from './timeline_marker';
import { useTimelineNode } from './use_timeline_node';

const RailNode: FC<{ isFirst: boolean; isLast: boolean; children: ReactNode }> = ({ isFirst, isLast, children }) => {
    const node = useMemo(() => ({ isFirst, isLast }), [isFirst, isLast]);
    return <RailNodeContext.Provider value={node}>{children}</RailNodeContext.Provider>;
};

export const Timeline: FC<{ children: ReactNode; className?: string }> = ({ children, className = '' }) => {
    const entries = Children.toArray(children).filter(isValidElement);
    return (
        <div className={`relative pl-14 ${className}`}>
            <InTimelineContext.Provider value={true}>
                {entries.map((entry, index) => (
                    <RailNode key={entry.key} isFirst={index === 0} isLast={index === entries.length - 1}>
                        {entry}
                    </RailNode>
                ))}
            </InTimelineContext.Provider>
        </div>
    );
};

export const TimelineEntry: FC<{
    id: string;
    icon: IconSpec;
    header: ReactNode;
    children?: ReactNode;
    className?: string;
    markerAnchor?: 'center' | 'first-line';
}> = ({ id, icon, header, children, className = '', markerAnchor = 'center' }) => {
    const inTimeline = useContext(InTimelineContext);
    if (!inTimeline) throw new Error('TimelineEntry must be used within a Timeline');
    const { isFirst, isLast } = useContext(RailNodeContext);
    const { ref, isActive } = useTimelineRegistration();
    const { toggle, revealed } = useTimelineNode();

    const anchorToFirstLine = markerAnchor === 'first-line';
    const rail = railClasses(anchorToFirstLine);

    return (
        <div ref={ref} data-timeline-entry={id} className={`relative pb-1.5 last:pb-0 ${className}`}>
            <div className="relative">
                {!isFirst && <RailSegment className={rail.upper} />}
                {(!isLast || revealed) && <RailSegment className={rail.lower} />}
                <TimelineMarker
                    icon={icon}
                    isActive={isActive}
                    anchorToFirstLine={anchorToFirstLine}
                    onActivate={() => ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                />
                <EntryHeader collapsible={Boolean(children)} revealed={revealed} toggle={toggle}>
                    {header}
                </EntryHeader>
            </div>
            {children && (
                <CollapsibleRegion
                    revealed={revealed}
                    className="relative"
                    overlay={revealed && <RailSegment className={rail.body} />}
                >
                    <div
                        data-timeline-content={id}
                        className="bg-app-surface border-app-border [&::-webkit-scrollbar-thumb]:bg-app-border [&::-webkit-scrollbar-thumb:hover]:bg-app-text-muted max-h-96 scrollbar-auto [scrollbar-color:var(--app-border)_transparent] overflow-y-auto rounded-b-lg border border-t-0 p-2 [&::-webkit-scrollbar]:w-3.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent"
                    >
                        <EntryIdContext.Provider value={id}>{children}</EntryIdContext.Provider>
                    </div>
                </CollapsibleRegion>
            )}
        </div>
    );
};
