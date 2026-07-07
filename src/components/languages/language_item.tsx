import { FC } from 'react';
import Icon from '../common/icon';
import ItemTitle from '../common/item_title';
import { Language } from './language';

const LanguageItem: FC<{ item: Language }> = ({ item }) => {
    return (
        <li className="hover:bg-app-surface-alt rounded-lg px-4 py-2 transition-colors">
            <div className="flex items-center gap-3">
                <div className="shrink-0 text-left">
                    <Icon
                        src={item.icon}
                        alt="language icon"
                        className="bg-app-icon-bg h-[27px] w-auto rounded shadow-[0_1px_4px_var(--app-shadow)]"
                    />
                </div>
                <div className="w-1/3 text-left">
                    <ItemTitle>{item.label}</ItemTitle>
                </div>
                <div className="text-app-text-muted flex-1 text-right max-sm:text-base">
                    <span>{item.proficiency}</span>
                </div>
            </div>
        </li>
    );
};

export default LanguageItem;
