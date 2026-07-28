import { FC } from 'react';
import Icon, { BADGE_ICON } from '../common/icon';
import { Language } from './language';

const LanguageItem: FC<{ item: Language }> = ({ item }) => (
    <li className="flex items-center gap-2">
        <Icon src={item.icon} alt={`${item.label} language icon`} className={BADGE_ICON} />
        <div>
            <span className="font-semibold tracking-[-0.02em] max-sm:font-normal">{item.label}</span>
            <span className="text-app-text-muted block text-sm">{item.proficiency}</span>
        </div>
    </li>
);

export default LanguageItem;
