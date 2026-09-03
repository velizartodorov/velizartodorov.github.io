import { FC, KeyboardEvent, ReactNode } from 'react';
import ChevronToggleButton from './chevron_toggle_button';

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

export const EntryHeader: FC<{ collapsible: boolean; revealed: boolean; toggle: () => void; children: ReactNode }> = ({
    collapsible,
    revealed,
    toggle,
    children,
}) => (
    <div
        {...(collapsible ? revealTriggerProps(toggle, revealed) : {})}
        className={`relative py-2 pr-8 pl-3 transition-[filter,border-radius] duration-300 ${
            collapsible
                ? 'bg-app-surface-alt border-app-border cursor-pointer border hover:brightness-95 dark:hover:brightness-125'
                : ''
        } ${collapsible && revealed ? 'rounded-t-lg' : 'rounded-lg'}`}
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
