import { FC, KeyboardEvent, ReactNode } from 'react';
import ChevronToggleButton from './chevron_toggle_button';
import { SURFACE_PANEL_ALT_BASE } from './surface_panel';

export const ACCORDION_HEADER_BASE = `${SURFACE_PANEL_ALT_BASE} hover:brightness-95 dark:hover:brightness-125`;

const revealTriggerProps = (toggle: () => void, revealed: boolean) => ({
    onClick: toggle,
    onKeyDown: (e: KeyboardEvent<HTMLElement>) => {
        if (e.key !== 'Enter' && e.key !== ' ') return;
        e.preventDefault();
        toggle();
    },
    role: 'button' as const,
    tabIndex: 0,
    'aria-expanded': revealed,
});

export const EntryHeader: FC<{
    collapsible: boolean;
    boxed?: boolean;
    revealed: boolean;
    toggle: () => void;
    children: ReactNode;
}> = ({ collapsible, boxed = collapsible, revealed, toggle, children }) => {
    const boxClassName = boxed ? ACCORDION_HEADER_BASE : '';
    const cursorClassName = boxed && collapsible ? 'cursor-pointer' : '';
    const roundedClassName = collapsible && revealed ? 'rounded-t-lg' : 'rounded-lg';

    return (
        <div
            {...(collapsible ? revealTriggerProps(toggle, revealed) : {})}
            className={`relative py-2 pr-8 pl-3 transition-all duration-300 ${boxClassName} ${cursorClassName} ${roundedClassName}`}
        >
            {children}
            {collapsible && (
                <ChevronToggleButton
                    open={revealed}
                    onToggle={toggle}
                    className="absolute top-1/2 right-2 z-10 -translate-y-1/2"
                />
            )}
        </div>
    );
};
