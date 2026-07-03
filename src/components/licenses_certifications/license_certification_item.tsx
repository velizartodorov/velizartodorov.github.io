import { FC } from 'react';
import { AccordionChevron } from '../common/accordion';
import { cx } from '../common/utils';
import { LicenseCertification } from './license_certification';
import { useMonthYear } from './licenses_certrifications.init';

const LicenseCertificationItem: FC<{ item: LicenseCertification; index: number }> = ({ item }) => {
    const hasLink = Boolean(item.link?.trim());
    const getMonthYear = useMonthYear();
    const monthYearStr = getMonthYear(item.date);
    const Tag = hasLink ? 'a' : 'div';

    return (
        <li>
            <Tag
                href={hasLink ? item.link : undefined}
                rel={hasLink ? 'noopener noreferrer' : undefined}
                className={cx(
                    'hover:bg-app-surface-alt focus:bg-app-surface-alt block rounded-lg px-3 py-2 transition-colors',
                    'hover:no-underline focus:no-underline',
                )}
            >
                <div className="flex items-center gap-3">
                    <div className="flex min-w-0 flex-1 items-center gap-3">
                        <div className="shrink-0 text-left">
                            <img
                                src={item.icon}
                                alt="license icon"
                                className={cx(
                                    'bg-app-icon-bg h-[25px] w-[30px] rounded',
                                    'shadow-[0_1px_4px_var(--app-shadow)]',
                                )}
                            />
                        </div>
                        <div className="w-9/12 text-left md:w-5/12">
                            <h5 className="mb-0 text-xl max-sm:text-base max-sm:font-normal">{item.name}</h5>
                        </div>
                        <div className="hidden flex-1 pl-0 text-left sm:block">{item.institution}</div>
                        <div className="hidden shrink-0 text-right sm:block">
                            <h5 className="mb-0 text-xl max-sm:text-base max-sm:font-normal">{monthYearStr}</h5>
                        </div>
                    </div>
                    {/* Invisible copy of AccordionItem's real chevron so this row reserves the exact same
                    space, keeping columns aligned with the Employments/Education rows. */}
                    <AccordionChevron open={false} className="text-app-text-muted invisible h-5 w-5" />
                </div>
            </Tag>
        </li>
    );
};

export default LicenseCertificationItem;
