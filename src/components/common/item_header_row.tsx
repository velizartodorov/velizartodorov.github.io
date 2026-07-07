import { FC, ReactNode } from 'react';
import Icon from './icon';
import ItemTitle from './item_title';

interface ItemHeaderRowProps {
    icon: { src: string; alt: string; className: string };
    title: ReactNode;
    titleClassName?: string;
    place?: ReactNode;
    period?: ReactNode;
    // Rendered as-is after place/period, always visible. Escape hatch for callers whose trailing
    // column doesn't fit the place/period slots' hidden-on-mobile + ItemTitle styling (e.g. the
    // languages list, whose proficiency column stays visible on narrow screens).
    trailing?: ReactNode;
    className?: string;
}

// Shared icon/title/place/period row used by employment, education, license and presentation
// list items so the column widths (and the sm:block breakpoints hiding place/period on narrow
// screens) stay in sync across those sections.
const ItemHeaderRow: FC<ItemHeaderRowProps> = ({
    icon,
    title,
    titleClassName = 'w-9/12 text-left md:w-5/12',
    place,
    period,
    trailing,
    className = 'w-full',
}) => (
    <div className={`flex items-center gap-3 ${className}`}>
        <div className="shrink-0 text-left">
            <Icon src={icon.src} alt={icon.alt} className={icon.className} />
        </div>
        <div className={titleClassName}>
            <ItemTitle>{title}</ItemTitle>
        </div>
        {place !== undefined && <div className="hidden flex-1 sm:block">{place}</div>}
        {period !== undefined && (
            <div className="hidden shrink-0 text-right sm:block">
                <ItemTitle>{period}</ItemTitle>
            </div>
        )}
        {trailing}
    </div>
);

export default ItemHeaderRow;
