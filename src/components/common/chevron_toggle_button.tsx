import { FC } from 'react';
import { Chevron } from './chevron';

// Shared button for pinning a scroll-faded element (a TimelineEntry's content, or a nested
// TimelineRow) open/closed regardless of scroll position - see useTimelineNode's togglePin.
const ChevronToggleButton: FC<{ open: boolean; onToggle: () => void; className?: string }> = ({
    open,
    onToggle,
    className = '',
}) => (
    <button
        type="button"
        aria-label={open ? 'Collapse' : 'Expand'}
        aria-expanded={open}
        // Stops the click from also bubbling to a clickable ancestor (TimelineEntry's header is
        // clickable too, toggling the same state) - without this, clicking the chevron itself
        // would fire both handlers and toggle twice, cancelling itself out.
        onClick={(e) => {
            e.stopPropagation();
            onToggle();
        }}
        className={`bg-app-surface-alt text-app-text-muted hover:bg-app-border hover:text-app-text flex size-6 shrink-0 cursor-pointer items-center justify-center rounded-md border border-transparent transition-colors ${className}`}
    >
        <Chevron open={open} className="size-4" />
    </button>
);

export default ChevronToggleButton;
