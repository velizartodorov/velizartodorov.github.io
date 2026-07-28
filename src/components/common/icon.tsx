import { FC } from 'react';

interface IconProps {
    src: string;
    alt: string;
    className?: string;
}

export const BADGE_ICON = 'bg-app-icon-bg h-[27px] w-auto rounded shadow-[0_1px_4px_var(--app-shadow)]';

const Icon: FC<IconProps> = ({ src, alt, className }) => (
    <img src={src} alt={alt} className={className} loading="lazy" decoding="async" />
);

export default Icon;
