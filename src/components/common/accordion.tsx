import { createContext, FC, ReactNode, useContext, useState } from 'react';

interface AccordionCtx {
  openKey: string | null;
  toggle: (key: string) => void;
}

const AccordionContext = createContext<AccordionCtx | null>(null);

/** Groups AccordionItems so opening one closes the others, like Bootstrap's default (non-alwaysOpen) Accordion. */
export const AccordionGroup: FC<{ children: ReactNode }> = ({ children }) => {
  const [openKey, setOpenKey] = useState<string | null>(null);
  const toggle = (key: string) => setOpenKey((prev) => (prev === key ? null : key));
  return (
    <AccordionContext.Provider value={{ openKey, toggle }}>
      <div className="space-y-2">{children}</div>
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
    <div className="overflow-hidden rounded-lg border border-app-border">
      <button
        type="button"
        onClick={() => ctx.toggle(eventKey)}
        aria-expanded={isOpen}
        className="flex w-full cursor-pointer items-center gap-3 bg-app-surface-alt px-4 py-3 text-left transition-[filter] hover:brightness-95 dark:hover:brightness-125"
      >
        <span className="min-w-0 flex-1">{header}</span>
        <span
          aria-hidden="true"
          className={`shrink-0 text-xl text-app-text-muted transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        >
          ▾
        </span>
      </button>
      <div className={`grid transition-[grid-template-rows] duration-200 ease-out ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
        <div className="overflow-hidden">
          <div className="px-4 pt-3 pb-4">{children}</div>
        </div>
      </div>
    </div>
  );
};
