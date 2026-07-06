import { FC } from 'react';
import { tw } from '../common/utils';
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
                )}
            >
                <div className="flex items-center gap-3">
                    <div className="shrink-0 text-left">
                        <img
                            src={item.icon}
                            alt="presentation icon"
                            className="bg-app-icon-bg h-[27px] w-auto rounded shadow-[0_1px_4px_var(--app-shadow)]"
                        />
                    </div>
                    <div className="w-9/12 text-left md:w-5/12">
                        <h5 className="mb-0 text-xl max-sm:text-base max-sm:font-normal">{item.name}</h5>
                    </div>
                </div>
            </a>
        </li>
    );
};

export default PresentationItem;
