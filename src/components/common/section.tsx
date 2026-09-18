import { FC, ReactNode, useRef } from 'react';
import { useScrollFade } from './use_scroll_fade';
import { SURFACE_PANEL_ALT_BASE } from './surface_panel';

interface SectionComponentProps {
    title: ReactNode;
    children: ReactNode;
    className?: string;
    id?: string;
    card?: boolean;
    cardClassName?: string;
    topPadding?: boolean;
}

const Section: FC<SectionComponentProps> = ({
    title,
    children,
    className = '',
    id,
    card = false,
    cardClassName = '',
    topPadding = true,
}) => {
    const ref = useRef<HTMLDivElement>(null);
    useScrollFade(ref);

    return (
        <div ref={ref} id={id} className={`scroll-mt-20 ${topPadding ? 'pt-6' : 'pt-2'} ${className}`}>
            <h4 className="text-app-text m-0 mb-3 text-[clamp(0.6rem,-1rem+9vw,1.5rem)] font-semibold tracking-tight">
                {title}
            </h4>
            {card ? (
                <div className={`${SURFACE_PANEL_ALT_BASE} rounded-lg p-2 ${cardClassName}`}>{children}</div>
            ) : (
                children
            )}
        </div>
    );
};

export default Section;
