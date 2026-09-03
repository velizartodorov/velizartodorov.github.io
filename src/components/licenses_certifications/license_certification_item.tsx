import { FC } from 'react';
import ItemHeaderRow from '../common/item_header_row';
import { HOVER_ROW, HOVER_ROW_LINK } from '../common/list_row';
import { TimelineEntry } from '../common/timeline';
import { TimelineRail, TimelineRow } from '../common/timeline_row';
import { Certification, LicenseInstitution } from './license_certification';
import { useMonthYear } from './licenses_certifications.init';

const ROW = `${HOVER_ROW} px-3 py-1`;
const LINK_ROW = `${HOVER_ROW_LINK} px-3 py-1`;

const CertificationContent: FC<{ cert: Certification; monthYear: string }> = ({ cert, monthYear }) => {
    const hasLink = Boolean(cert.link?.trim());
    const Tag = hasLink ? 'a' : 'div';

    return (
        <Tag
            href={hasLink ? cert.link : undefined}
            rel={hasLink ? 'noopener noreferrer' : undefined}
            className={hasLink ? LINK_ROW : ROW}
        >
            <ItemHeaderRow title={cert.name} place={cert.field || undefined} period={monthYear || undefined} />
        </Tag>
    );
};

const CertificationRow: FC<{ cert: Certification; monthYear: string; id: string }> = ({ cert, monthYear, id }) => (
    <TimelineRow id={id} header={<CertificationContent cert={cert} monthYear={monthYear} />} />
);

const SingleCertificationHeader: FC<{ institution: string; cert: Certification; monthYear: string }> = ({
    institution,
    cert,
    monthYear,
}) => {
    const hasLink = Boolean(cert.link?.trim());
    const Tag = hasLink ? 'a' : 'div';

    return (
        <Tag
            href={hasLink ? cert.link : undefined}
            rel={hasLink ? 'noopener noreferrer' : undefined}
            className={hasLink ? HOVER_ROW_LINK : undefined}
        >
            <ItemHeaderRow title={cert.name} place={institution} period={monthYear || undefined} />
        </Tag>
    );
};

const LicenseCertificationItem: FC<{ item: LicenseInstitution; index: number }> = ({ item, index }) => {
    const getMonthYear = useMonthYear();
    const certifications = item.certifications ?? [];
    const sortedDates = certifications
        .map((c) => c.date)
        .filter(Boolean)
        .sort((a, b) => a.localeCompare(b));
    const earliest = sortedDates[0];
    const latest = sortedDates.at(-1);
    const hasMultipleCertifications = certifications.length > 1;
    const headerPeriod =
        hasMultipleCertifications && earliest && latest
            ? `${getMonthYear(earliest)} - ${getMonthYear(latest)}`
            : undefined;
    const singleCert = certifications[0];

    return (
        <TimelineEntry
            id={String(index)}
            icon={{
                src: item.icon,
                alt: `${item.institution} logo`,
                invertOnDark: item.invertOnDark,
                fit: item.iconFit,
            }}
            header={
                hasMultipleCertifications || !singleCert ? (
                    <ItemHeaderRow
                        title={item.institution}
                        place={certifications[0]?.field ?? ''}
                        period={headerPeriod}
                    />
                ) : (
                    <SingleCertificationHeader
                        institution={item.institution}
                        cert={singleCert}
                        monthYear={getMonthYear(singleCert.date)}
                    />
                )
            }
        >
            {hasMultipleCertifications && (
                <TimelineRail className="space-y-1">
                    {certifications.map((cert, certIdx) => (
                        <CertificationRow
                            key={`${index}-${certIdx}`}
                            id={String(certIdx)}
                            cert={cert}
                            monthYear={getMonthYear(cert.date)}
                        />
                    ))}
                </TimelineRail>
            )}
        </TimelineEntry>
    );
};

export default LicenseCertificationItem;
