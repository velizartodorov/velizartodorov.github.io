import { FC } from 'react';
import { Chevron } from './chevron';

export const CHEVRON_TOGGLE_LABEL = { open: 'Collapse', closed: 'Expand' } as const;

const ChevronToggleButton: FC<{ open: boolean; onToggle: () => void; className?: string }> = ({
    open,
    onToggle,
    className = '',
}) => (
    <button
        type="button"
        data-chevron-toggle=""
        aria-label={open ? CHEVRON_TOGGLE_LABEL.open : CHEVRON_TOGGLE_LABEL.closed}
        aria-expanded={open}
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
