import { FC } from 'react';

export const Chevron: FC<{ open: boolean; className?: string }> = ({ open, className = '' }) => (
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
