import { FC } from 'react';
import { BADGE_ICON } from '../common/icon';
import ItemHeaderRow from '../common/item_header_row';
import { HOVER_ROW_LINK } from '../common/list_row';
import { Presentation } from './presentation';

const PresentationItem: FC<{ item: Presentation; index: number }> = ({ item }) => {
    return (
        <li>
            <a href={item.link} rel="noopener noreferrer" className={`${HOVER_ROW_LINK} px-4 py-2`}>
                <ItemHeaderRow
                    icon={{ src: item.icon, alt: 'presentation icon', className: BADGE_ICON }}
                    title={item.name}
                />
            </a>
        </li>
    );
};

export default PresentationItem;
