import { FC } from 'react';
import Icon from '../common/icon';
import ItemTitle from '../common/item_title';
import { tw } from '../common/tw';
import { Presentation } from './presentation';

const PresentationItem: FC<{ item: Presentation; index: number }> = ({ item }) => {
    return (
        <li>
            <a
                href={item.link}
                rel="noopener noreferrer"
                className={tw(
                    'hover:bg-app-surface-alt focus:bg-app-surface-alt block rounded-lg px-4 py-2 transition-colors',
                    'hover:no-underline focus:no-underline',
                    'text-app-link hover:text-app-link-hover',
                )}
            >
                <div className="flex items-center gap-3">
                    <div className="shrink-0 text-left">
                        <Icon
                            src={item.icon}
                            alt="presentation icon"
                            className="bg-app-icon-bg h-[27px] w-auto rounded shadow-[0_1px_4px_var(--app-shadow)]"
                        />
                    </div>
                    <div className="w-9/12 text-left md:w-5/12">
                        <ItemTitle>{item.name}</ItemTitle>
                    </div>
                </div>
            </a>
        </li>
    );
};

export default PresentationItem;
