import { FC } from 'react';

export const FIRST_LINE_MARKER_TOP = 'max-sm:top-[1.375rem]';

export const RailSegment: FC<{ className: string }> = ({ className }) => (
    <span
        data-timeline-rail=""
        aria-hidden="true"
        className={`bg-app-border absolute left-[-2.35rem] w-[2px] ${className}`}
    />
);

export const railClasses = (anchorToFirstLine: boolean) => ({
    upper: `top-0 bottom-1/2 ${anchorToFirstLine ? 'max-sm:bottom-auto max-sm:h-[1.375rem]' : ''}`,
    lower: `top-1/2 -bottom-1.5 ${anchorToFirstLine ? FIRST_LINE_MARKER_TOP : ''}`,
    body: 'top-0 -bottom-1.5',
});
