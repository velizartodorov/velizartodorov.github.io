import { FC } from 'react';

interface IconProps {
    src: string;
    alt: string;
    className?: string;
}

// Shared by the employment/education/license/presentation/language item rows so their icons
// stay lazy-loaded (they're below-the-fold list content) without hand-copying the same two
// attributes onto every <img> tag.
const Icon: FC<IconProps> = ({ src, alt, className }) => (
    <img src={src} alt={alt} className={className} loading="lazy" decoding="async" />
);

export default Icon;
