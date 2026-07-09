import { FC } from 'react';
import { AccordionItem } from '../common/accordion';
import ItemHeaderRow from '../common/item_header_row';
import ItemTitle from '../common/item_title';
import { HOVER_ROW, HOVER_ROW_LINK } from '../common/list_row';
import { LicenseInstitution } from './license_certification';
import { useMonthYear } from './licenses_certrifications.init';

const ICON = 'bg-app-icon-bg h-[25px] w-[30px] rounded shadow-[0_1px_4px_var(--app-shadow)]';
const ROW = `${HOVER_ROW} px-3 py-1`;
const LINK_ROW = `${HOVER_ROW_LINK} px-3 py-1`;

const LicenseCertificationItem: FC<{ item: LicenseInstitution; index: number; eventKey: string }> = ({
    item,
    index,
    eventKey,
}) => {
    const getMonthYear = useMonthYear();
    const certifications = item.certifications ?? [];
    const sortedDates = certifications
        .map((c) => c.date)
        .filter(Boolean)
        .sort((a, b) => a.localeCompare(b));
    const earliest = sortedDates[0];
    const latest = sortedDates.at(-1);
    const headerPeriod =
        certifications.length > 1 && earliest && latest
            ? `${getMonthYear(earliest)} - ${getMonthYear(latest)}`
            : undefined;

    const header = (
        <ItemHeaderRow
            icon={{ src: item.icon, alt: 'institution icon', className: ICON }}
            title={item.institution}
            place={certifications[0]?.field ?? ''}
            period={headerPeriod}
        />
    );

    return (
        <AccordionItem eventKey={eventKey} header={header}>
            <div
                className={`before:bg-app-border relative space-y-1 pl-6 before:absolute before:inset-y-2 before:left-[9px] before:w-[2px] before:content-['']`}
            >
                {certifications.map((cert, certIdx) => {
                    const hasLink = Boolean(cert.link?.trim());
                    const Tag = hasLink ? 'a' : 'div';
                    const monthYear = getMonthYear(cert.date);
                    return (
                        <div
                            key={`${index}-${certIdx}`}
                            className={`before:border-app-surface before:bg-app-accent relative before:absolute before:top-2 before:-left-5 before:size-3 before:rounded-full before:border-2 before:shadow-[0_0_0_1px_var(--app-accent)] before:transition-transform before:duration-200 before:content-[''] hover:before:scale-[1.15]`}
                        >
                            <Tag
                                href={hasLink ? cert.link : undefined}
                                rel={hasLink ? 'noopener noreferrer' : undefined}
                                className={hasLink ? LINK_ROW : ROW}
                            >
                                <ItemTitle>{cert.name}</ItemTitle>
                                <div className="text-app-text-muted flex flex-wrap items-baseline gap-x-2">
                                    {cert.field && <span>{cert.field}</span>}
                                    {monthYear && <span>{monthYear}</span>}
                                </div>
                            </Tag>
                        </div>
                    );
                })}
            </div>
        </AccordionItem>
    );
};

export default LicenseCertificationItem;
