import { FC } from 'react';
import { Language } from './language';

const LanguageItem: FC<{ item: Language }> = ({ item }) => {
    return (
        <li className="hover:bg-app-surface-alt rounded-lg px-4 py-2 transition-colors">
            <div className="flex items-center gap-3">
                <div className="shrink-0 text-left">
                    <img
                        src={item.icon}
                        alt="language icon"
                        className="bg-app-icon-bg h-[27px] w-auto rounded shadow-[0_1px_4px_var(--app-shadow)]"
                    />
                </div>
                <div className="w-1/3 text-left">
                    <h5 className="mb-0 text-xl font-semibold tracking-[-0.02em] max-sm:text-base max-sm:font-normal">
                        {item.label}
                    </h5>
                </div>
                <div className="text-app-text-muted flex-1 text-right max-sm:text-base">
                    <span>{item.proficiency}</span>
                </div>
            </div>
        </li>
    );
};

export default LanguageItem;
