import { FC } from 'react';
import ItemHeaderRow from '../common/item_header_row';
import { TimelineEntry } from '../common/timeline';
import { Language } from './language';

const LanguageItem: FC<{ item: Language; index: number }> = ({ item, index }) => (
    <TimelineEntry
        id={String(index)}
        icon={{ src: item.icon, alt: `${item.label} language icon` }}
        header={
            <ItemHeaderRow
                title={item.label}
                titleClassName="w-1/3 text-left"
                trailing={
                    <div className="text-app-text-muted flex-1 text-right max-sm:text-base">
                        <span>{item.proficiency}</span>
                    </div>
                }
            />
        }
    />
);

export default LanguageItem;
