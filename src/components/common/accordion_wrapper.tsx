import { FC, useState } from 'react';
import { AccordionChevron } from './accordion';
import { Properties } from './properties';
import { tw } from './utils';

const AccordionWrapper: FC<Properties> = ({ title, children, className = '' }) => {
    const [open, setOpen] = useState(true);
    return (
        <div
            className={tw(
                'border-app-border bg-app-surface overflow-hidden rounded-xl border',
                'shadow-[0_1px_3px_var(--app-shadow)]',
                className,
            )}
        >
            <button
                type="button"
                onClick={() => setOpen((o) => !o)}
                aria-expanded={open}
                className={tw(
                    'bg-app-surface-alt flex w-full cursor-pointer items-center justify-between gap-3 rounded-t-xl',
                    'px-4 py-2 text-left transition-[filter] hover:brightness-95 dark:hover:brightness-125',
                )}
            >
                {/* Sized to keep the longest current title ("Licenses & certifications ðŸ”–", ~27 chars)
            on one line down to ~320px viewports, with some margin to spare. If a longer title
            is ever added in either language, re-check it still fits at narrow widths. */}
                <h4 className="text-app-text m-0 text-[clamp(0.6rem,-1rem+9vw,1.5rem)] font-semibold tracking-tight">
                    {title}
                </h4>
                <AccordionChevron open={open} className="text-app-text-muted h-6 w-6" />
            </button>
            <div
                className={tw(
                    'grid transition-[grid-template-rows] duration-200 ease-out',
                    open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
                )}
            >
                <div className="overflow-hidden">
                    <div className="px-4 pt-3 pb-4">{children}</div>
                </div>
            </div>
        </div>
    );
};

export default AccordionWrapper;
