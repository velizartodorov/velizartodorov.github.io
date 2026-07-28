import { FC, ReactNode, useContext } from 'react';
import ChevronToggleButton from './chevron_toggle_button';
import { CollapsibleRegion } from './collapsible_region';
import { EntryIdContext } from './timeline_context';
import { useTimelineNode } from './use_timeline_node';

export const TimelineRail: FC<{ children: ReactNode; className?: string }> = ({ children, className = '' }) => (
    <div
        className={`before:bg-app-border relative mt-3 pl-6 before:absolute before:inset-y-2 before:left-[9px] before:w-[2px] before:content-[''] ${className}`}
    >
        {children}
    </div>
);

export const TimelineRow: FC<{ id: string; header?: ReactNode; children?: ReactNode; className?: string }> = ({
    id,
    header,
    children,
    className = '',
}) => {
    const entryId = useContext(EntryIdContext);
    if (entryId === null) throw new Error('TimelineRow must be used within a TimelineEntry');
    const { toggle, revealed } = useTimelineNode();
    return (
        <div
            data-timeline-row={id}
            // eslint-disable-next-line tailwindcss/no-unnecessary-arbitrary-value
            className={`before:bg-app-accent before:border-app-surface relative before:absolute before:top-2 before:-left-5 before:size-3 before:rounded-full before:border-2 before:shadow-[0_0_0_1px_var(--app-accent)] before:transition-transform before:duration-200 before:content-[''] hover:before:scale-[1.15] ${className}`}
        >
            {header && <div className={children ? 'pr-8' : ''}>{header}</div>}
            {children && (
                <>
                    <ChevronToggleButton open={revealed} onToggle={toggle} className="absolute top-1 right-1 z-10" />
                    <CollapsibleRegion revealed={revealed}>
                        <div data-timeline-row-content="" className="pr-8">
                            {children}
                        </div>
                    </CollapsibleRegion>
                </>
            )}
        </div>
    );
};
