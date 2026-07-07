import { FC } from 'react';
import { AccordionChevron } from '../common/accordion';
import ItemHeaderRow from '../common/item_header_row';
import { HOVER_ROW, HOVER_ROW_LINK } from '../common/list_row';
import { LicenseCertification } from './license_certification';
import { useMonthYear } from './licenses_certrifications.init';

const ROW = `${HOVER_ROW} px-3 py-2`;
const LINK_ROW = `${HOVER_ROW_LINK} px-3 py-2`;
const ICON = 'bg-app-icon-bg h-[25px] w-[30px] rounded shadow-[0_1px_4px_var(--app-shadow)]';

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
                className={hasLink ? LINK_ROW : ROW}
            >
                <div className="flex items-center gap-3">
                    <ItemHeaderRow
                        icon={{ src: item.icon, alt: 'license icon', className: ICON }}
                        title={item.name}
                        place={item.institution}
                        period={monthYearStr}
                        className="min-w-0 flex-1"
                    />
                    {/* Invisible copy of AccordionItem's real chevron so this row reserves the exact same
                    space, keeping columns aligned with the Employments/Education rows. */}
                    <AccordionChevron open={false} className="text-app-text-muted invisible size-5" />
                </div>
            </Tag>
        </li>
    );
};

export default LicenseCertificationItem;
