import { createContext, FC, ReactNode, useCallback, useContext, useMemo, useState } from 'react';
import { cx } from './utils';

interface AccordionCtx {
    openKey: string | null;
    toggle: (key: string) => void;
}

const AccordionContext = createContext<AccordionCtx | null>(null);

export const AccordionChevron: FC<{ open: boolean; className?: string }> = ({ open, className = '' }) => (
    <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        className={`shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''} ${className}`}
    >
        <polyline points="6 9 12 15 18 9" />
    </svg>
);

/** Groups AccordionItems so opening one closes the others, like Bootstrap's default (non-alwaysOpen) Accordion. */
export const AccordionGroup: FC<{ children: ReactNode; className?: string }> = ({
    children,
    className = 'space-y-2',
}) => {
    const [openKey, setOpenKey] = useState<string | null>(null);
    const toggle = useCallback((key: string) => setOpenKey((prev) => (prev === key ? null : key)), []);
    const contextValue = useMemo(() => ({ openKey, toggle }), [openKey, toggle]);
    return (
        <AccordionContext.Provider value={contextValue}>
            <div className={className}>{children}</div>
        </AccordionContext.Provider>
    );
};

export const AccordionItem: FC<{ eventKey: string; header: ReactNode; children: ReactNode }> = ({
    eventKey,
    header,
    children,
}) => {
    const ctx = useContext(AccordionContext);
    if (!ctx) throw new Error('AccordionItem must be used within an AccordionGroup');
    const isOpen = ctx.openKey === eventKey;
    return (
        <div className="border-app-border overflow-hidden rounded-lg border">
            <button
                type="button"
                onClick={() => ctx.toggle(eventKey)}
                aria-expanded={isOpen}
                className={cx(
                    'bg-app-surface-alt flex w-full cursor-pointer items-center gap-3 px-3 py-2 text-left',
                    'transition-[filter] hover:brightness-95 dark:hover:brightness-125',
                )}
            >
                <span className="min-w-0 flex-1">{header}</span>
                <AccordionChevron open={isOpen} className="text-app-text-muted h-5 w-5" />
            </button>
            <div
                className={cx(
                    'grid transition-[grid-template-rows] duration-200 ease-out',
                    isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
                )}
            >
                <div className="overflow-hidden">
                    <div className="px-4 pt-3 pb-4">{children}</div>
                </div>
            </div>
        </div>
    );
};
