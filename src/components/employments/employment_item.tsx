import { FC } from 'react';

import { useTranslation } from 'react-i18next';
import { AccordionItem } from '../common/accordion';
import Icon from '../common/icon';
import ItemTitle from '../common/item_title';
import Markdown from '../common/markdown';
import { tw } from '../common/tw';
import { Employment } from './employment';
import { combinedPeriod, useDisplayPeriod } from './utils';

const EmploymentItem: FC<{ item: Employment; index: number; eventKey: string }> = ({ item, index, eventKey }) => {
    const { t } = useTranslation();
    const { display } = useDisplayPeriod();
    const positions = item.positions ?? [];
    const headerPosition = positions[0];
    const headerPlace = headerPosition?.place ?? '';
    const headerPeriod = combinedPeriod(positions);
    const at = t('common:period.at');
    const headerTitle = headerPosition ? `${headerPosition.position} ${at} ${item.company}` : '';

    const header = (
        <div className="flex w-full items-center gap-3">
            <div className="shrink-0 text-left">
                <Icon src={item.icon} alt="company icon" className="w-[30px] rounded-lg" />
            </div>
            <div className="w-9/12 text-left md:w-5/12">
                <ItemTitle>{headerTitle}</ItemTitle>
            </div>
            <div className="hidden flex-1 sm:block">{headerPlace}</div>
            <div className="hidden shrink-0 text-right sm:block">
                <ItemTitle>{headerPeriod ? display(headerPeriod) : ''}</ItemTitle>
            </div>
        </div>
    );
    return (
        <AccordionItem eventKey={eventKey} header={header}>
            {item.type && <div className="mb-3">{`🏢 ${t('common:companyType')}: ${item.type}`}</div>}
            <div
                className={tw(
                    'before:bg-app-border relative space-y-7 pl-6',
                    "before:absolute before:inset-y-2 before:left-[9px] before:w-[2px] before:content-['']",
                )}
            >
                {positions.map((position, posIdx) => {
                    const showTitle = positions.length > 1;
                    return (
                        <div
                            key={`${index}-${posIdx}`}
                            className={tw(
                                'before:border-app-surface before:bg-app-accent relative before:absolute',
                                'before:top-2 before:-left-5 before:size-3 before:rounded-full before:border-2',
                                "before:shadow-[0_0_0_1px_var(--app-accent)] before:content-['']",
                                'before:transition-transform before:duration-200 hover:before:scale-[1.15]',
                            )}
                        >
                            {showTitle && (
                                <div className="mb-2 flex flex-col gap-1">
                                    <ItemTitle>{`${position.position}`}</ItemTitle>
                                    <div className="text-app-text-muted">
                                        {display({
                                            start: new Date(position.period.start),
                                            end: position.period.end ? new Date(position.period.end) : undefined,
                                        })}
                                    </div>
                                </div>
                            )}
                            {position.description && <Markdown>{position.description}</Markdown>}
                        </div>
                    );
                })}
            </div>
        </AccordionItem>
    );
};

export default EmploymentItem;
