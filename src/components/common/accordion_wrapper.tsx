import { FC, useState } from 'react';
import { AccordionChevron } from './accordion';
import { Properties } from './properties';

const AccordionWrapper: FC<Properties> = ({ title, children, className = '' }) => {
  const [open, setOpen] = useState(true);
  return (
    <div className={`overflow-hidden rounded-xl border border-app-border bg-app-surface shadow-[0_1px_3px_var(--app-shadow)] ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full cursor-pointer items-center justify-between gap-3 rounded-t-xl bg-app-surface-alt px-4 py-2 text-left transition-[filter] hover:brightness-95 dark:hover:brightness-125"
      >
        <h4 className="m-0 font-semibold tracking-tight text-app-text text-[clamp(0.6rem,-0.75rem+9vw,1.5rem)]">
          {title}
        </h4>
        <AccordionChevron open={open} className="h-6 w-6 text-app-text-muted" />
      </button>
      <div className={`grid transition-[grid-template-rows] duration-200 ease-out ${open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
        <div className="overflow-hidden">
          <div className="px-4 pt-3 pb-4">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default AccordionWrapper;
