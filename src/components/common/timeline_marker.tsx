import { FC } from 'react';
import { FIRST_LINE_MARKER_TOP } from './rail_segment';

export type IconSpec = { src: string; alt: string; invertOnDark?: boolean; fit?: 'cover' | 'contain' };

export const TimelineMarker: FC<{
    icon: IconSpec;
    isActive: boolean;
    anchorToFirstLine: boolean;
    onActivate: () => void;
}> = ({ icon, isActive, anchorToFirstLine, onActivate }) => (
    <button
        type="button"
        aria-label={icon.alt}
        aria-current={isActive ? 'true' : undefined}
        onClick={onActivate}
        className={`bg-app-surface-alt absolute top-1/2 -left-14 size-9 -translate-y-1/2 overflow-hidden rounded-full border-2 transition-colors ${
            anchorToFirstLine ? FIRST_LINE_MARKER_TOP : ''
        } ${isActive ? 'border-app-accent shadow-[0_0_0_3px_var(--app-accent-subtle)]' : 'border-app-border'}`}
    >
        <img
            src={icon.src}
            alt=""
            className={`size-full ${icon.fit === 'contain' ? 'object-contain p-0.5' : 'object-cover'} ${
                icon.invertOnDark ? 'dark:invert' : ''
            }`}
        />
    </button>
);
