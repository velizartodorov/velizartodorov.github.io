import { FC, ReactNode } from 'react';
import Icon from './icon';
import ItemTitle from './item_title';

interface ItemHeaderRowProps {
    icon?: { src: string; alt: string; className: string };
    title: ReactNode;
    titleClassName?: string;
    place?: ReactNode;
    period?: ReactNode;
    className?: string;
}

const ItemHeaderRow: FC<ItemHeaderRowProps> = ({
    icon,
    title,
    titleClassName = 'w-9/12 text-left md:w-5/12',
    place,
    period,
    className = 'w-full items-center',
}) => (
    <div className={`flex gap-3 ${className}`}>
        {icon && (
            <div className="shrink-0 text-left">
                <Icon src={icon.src} alt={icon.alt} className={icon.className} />
            </div>
        )}
        <div className={titleClassName}>
            <ItemTitle>{title}</ItemTitle>
        </div>
        {place !== undefined && <div className="hidden flex-1 sm:block">{place}</div>}
        {period !== undefined && (
            <div className="hidden shrink-0 text-right sm:block">
                <ItemTitle>{period}</ItemTitle>
            </div>
        )}
    </div>
);

export default ItemHeaderRow;
