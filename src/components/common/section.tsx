import { FC, ReactNode, useRef } from 'react';
import { useScrollFade } from './use_scroll_fade';

interface SectionComponentProps {
    title: ReactNode;
    children: ReactNode;
    className?: string;
    id?: string;
}

const Section: FC<SectionComponentProps> = ({ title, children, className = '', id }) => {
    const ref = useRef<HTMLDivElement>(null);
    useScrollFade(ref);

    return (
        <div ref={ref} id={id} className={`scroll-mt-20 pt-6 ${className}`}>
            <h4 className="text-app-text m-0 mb-3 text-[clamp(0.6rem,-1rem+9vw,1.5rem)] font-semibold tracking-tight">
                {title}
            </h4>
            {children}
        </div>
    );
};

export default Section;
