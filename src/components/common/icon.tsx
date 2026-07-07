import { FC } from 'react';

interface IconProps {
    src: string;
    alt: string;
    className?: string;
}

// Small square icon badge shared by presentation and language list rows.
export const BADGE_ICON = 'bg-app-icon-bg h-[27px] w-auto rounded shadow-[0_1px_4px_var(--app-shadow)]';

// Shared by the employment/education/license/presentation/language item rows so their icons
// stay lazy-loaded (they're below-the-fold list content) without hand-copying the same two
// attributes onto every <img> tag.
const Icon: FC<IconProps> = ({ src, alt, className }) => (
    <img src={src} alt={alt} className={className} loading="lazy" decoding="async" />
);

export default Icon;
