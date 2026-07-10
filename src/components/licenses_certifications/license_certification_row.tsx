import { FC } from 'react';
import { AccordionChevron } from '../common/accordion';
import ItemHeaderRow from '../common/item_header_row';
import { HOVER_ROW, HOVER_ROW_LINK } from '../common/list_row';
import { LicenseInstitution } from './license_certification';
import { useMonthYear } from './licenses_certifications.init';

const ROW = `${HOVER_ROW} px-3 py-2`;
const LINK_ROW = `${HOVER_ROW_LINK} px-3 py-2`;
const ICON = 'bg-app-icon-bg h-[25px] w-[30px] rounded shadow-[0_1px_4px_var(--app-shadow)]';

const LicenseCertificationRow: FC<{ item: LicenseInstitution }> = ({ item }) => {
    const cert = item.certifications[0];
    const getMonthYear = useMonthYear();
    if (!cert) return null;

    const hasLink = Boolean(cert.link?.trim());
    const monthYearStr = getMonthYear(cert.date);
    const Tag = hasLink ? 'a' : 'div';

    return (
        <li>
            <Tag
                href={hasLink ? cert.link : undefined}
                rel={hasLink ? 'noopener noreferrer' : undefined}
                className={hasLink ? LINK_ROW : ROW}
            >
                <div className="flex items-center gap-3">
                    <ItemHeaderRow
                        icon={{ src: item.icon, alt: 'license icon', className: ICON }}
                        title={cert.name}
                        place={item.institution}
                        period={monthYearStr}
                        className="min-w-0 flex-1"
                    />
                    <AccordionChevron open={false} className="text-app-text-muted invisible size-5" />
                </div>
            </Tag>
        </li>
    );
};

export default LicenseCertificationRow;
