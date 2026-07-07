import { FC } from 'react';
import { BADGE_ICON } from '../common/icon';
import ItemHeaderRow from '../common/item_header_row';
import { HOVER_ROW } from '../common/list_row';
import { Language } from './language';

const LanguageItem: FC<{ item: Language }> = ({ item }) => {
    return (
        <li className={`${HOVER_ROW} px-4 py-2`}>
            <ItemHeaderRow
                icon={{ src: item.icon, alt: 'language icon', className: BADGE_ICON }}
                title={item.label}
                titleClassName="w-1/3 text-left"
                trailing={
                    <div className="text-app-text-muted flex-1 text-right max-sm:text-base">
                        <span>{item.proficiency}</span>
                    </div>
                }
            />
        </li>
    );
};

export default LanguageItem;
