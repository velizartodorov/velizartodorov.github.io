import { FC } from 'react';
import ItemHeaderRow from '../common/item_header_row';
import { PLAIN_LINK } from '../common/list_row';
import { TimelineEntry } from '../common/timeline';
import { Presentation } from './presentation';

const PresentationItem: FC<{ item: Presentation; index: number }> = ({ item, index }) => (
    <TimelineEntry
        id={String(index)}
        icon={{ src: item.icon, alt: `${item.name} icon` }}
        boxed
        header={
            <a href={item.link} rel="noopener noreferrer" className={PLAIN_LINK}>
                <ItemHeaderRow title={item.name} titleClassName="w-full text-left" />
            </a>
        }
    />
);

export default PresentationItem;
