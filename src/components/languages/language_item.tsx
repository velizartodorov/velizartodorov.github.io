import { FC } from 'react';
import Icon, { BADGE_ICON } from '../common/icon';
import ItemTitle from '../common/item_title';
import { Language } from './language';

const LanguageItem: FC<{ item: Language }> = ({ item }) => (
    <li className="flex items-center gap-2">
        <Icon src={item.icon} alt={`${item.label} language icon`} className={BADGE_ICON} />
        <div className="flex flex-col md:flex-row md:items-baseline md:gap-2">
            <ItemTitle>{item.label}</ItemTitle>
            <span className="text-app-text-muted text-sm">{item.proficiency}</span>
        </div>
    </li>
);

export default LanguageItem;
