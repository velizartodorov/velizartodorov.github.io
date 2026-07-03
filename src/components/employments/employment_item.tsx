import { FC } from 'react';

import { useTranslation } from 'react-i18next';
import { AccordionItem } from '../common/accordion';
import { bullet } from '../common/utils';
import { Employment } from './employment';
import { combinedPeriod, useDisplayPeriod } from './utils';
import { Reference } from '../common/reference';

const EmploymentItem: FC<{ item: Employment; index: number; eventKey: string }> = ({
    item,
    index,
    eventKey,
}) => {
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
                <img src={item.icon} alt="company icon" className="w-[30px] rounded-lg" />
            </div>
            <div className="w-9/12 text-left md:w-5/12">
                <h5 className="mb-0 text-xl max-sm:text-base max-sm:font-normal">{headerTitle}</h5>
            </div>
            <div className="hidden flex-1 sm:block">{headerPlace}</div>
            <div className="hidden shrink-0 text-right sm:block">
                <h5 className="mb-0 text-xl max-sm:text-base max-sm:font-normal">
                    {headerPeriod ? display(headerPeriod) : ''}
                </h5>
            </div>
        </div>
    );
    return (
        <AccordionItem eventKey={eventKey} header={header}>
            {item.type && (
                <div className="mb-3">{`🏢 ${t('common:companyType')}: ${item.type}`}</div>
            )}
            <div className="before:bg-app-border relative space-y-7 pl-6 before:absolute before:top-2 before:bottom-2 before:left-[9px] before:w-[2px] before:content-['']">
                {positions.map((position, posIdx) => {
                    const showTitle = positions.length > 1;
                    return (
                        <div
                            key={`${index}-${posIdx}`}
                            className="before:border-app-surface before:bg-app-accent relative before:absolute before:top-2 before:-left-5 before:h-3 before:w-3 before:rounded-full before:border-2 before:shadow-[0_0_0_1px_var(--app-accent)] before:transition-transform before:duration-200 before:content-[''] hover:before:scale-[1.15]"
                        >
                            {showTitle && (
                                <>
                                    <h5 className="mb-1 text-xl max-sm:text-base max-sm:font-normal">
                                        {`${position.position}`}
                                    </h5>
                                    <div className="text-app-text-muted mb-2">
                                        {display({
                                            start: new Date(position.period.start),
                                            end: position.period.end
                                                ? new Date(position.period.end)
                                                : undefined,
                                        })}
                                    </div>
                                </>
                            )}
                            {position.description?.map((bodyItem: string, descIdx: number) => (
                                <span key={`${index}-${posIdx}-${descIdx}`}>
                                    {bodyItem}
                                    <br />
                                </span>
                            ))}
                            {position.references?.map((link: Reference, refIdx: number) => (
                                <div key={`${link.href}-${refIdx}`}>
                                    <span>{bullet} </span>
                                    <a href={link.href}>{link.value}</a>
                                    <br />
                                </div>
                            ))}
                        </div>
                    );
                })}
            </div>
        </AccordionItem>
    );
};

export default EmploymentItem;
