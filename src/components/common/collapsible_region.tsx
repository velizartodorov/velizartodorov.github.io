import { FC, ReactNode } from 'react';

export const CollapsibleRegion: FC<{
    revealed: boolean;
    children: ReactNode;
    className?: string;
    overlay?: ReactNode;
}> = ({ revealed, children, className = '', overlay }) => (
    <div
        className={`grid transition-[grid-template-rows] duration-200 ease-out motion-reduce:transition-none ${
            revealed ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
        } ${className}`}
    >
        {overlay}
        <div className="overflow-hidden">{children}</div>
    </div>
);
