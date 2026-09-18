import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import ItemHeaderRow from '../common/item_header_row';
import Markdown from '../common/markdown';
import { TimelineEntry } from '../common/timeline';
import { TimelineRail, TimelineRow } from '../common/timeline_row';
import { Employment, Position } from './employment';
import { combinedPeriod, useDisplayPeriod } from './utils';

const PositionRow: FC<{
    position: Position;
    display: ReturnType<typeof useDisplayPeriod>['display'];
    id: string;
}> = ({ position, display, id }) => (
    <TimelineRow
        id={id}
        header={
            <div className="space-y-2">
                <ItemHeaderRow
                    title={position.position}
                    place={position.place || undefined}
                    period={display({
                        start: new Date(position.period.start),
                        end: position.period.end ? new Date(position.period.end) : undefined,
                    })}
                />
                {position.description && <Markdown>{position.description}</Markdown>}
            </div>
        }
    />
);

const EmploymentItem: FC<{ item: Employment; index: number }> = ({ item, index }) => {
    const { t } = useTranslation();
    const { display } = useDisplayPeriod();
    const positions = item.positions ?? [];
    const headerPosition = positions[0];
    const headerPlace = headerPosition?.place ?? '';
    const headerPeriod = combinedPeriod(positions);
    const at = t('common:period.at');
    const headerTitle = headerPosition ? `${headerPosition.position} ${at} ${item.company}` : '';
    const hasMultiplePositions = positions.length > 1;
    const hasContent = hasMultiplePositions || Boolean(headerPosition?.description) || Boolean(item.type);

    return (
        <TimelineEntry
            id={String(index)}
            icon={{
                src: item.icon,
                alt: `${item.company} logo`,
                invertOnDark: item.invertOnDark,
                fit: item.iconFit,
            }}
            header={
                <ItemHeaderRow
                    title={headerTitle}
                    place={headerPlace}
                    period={headerPeriod ? display(headerPeriod) : ''}
                />
            }
        >
            {hasContent && (
                <>
                    {hasMultiplePositions ? (
                        <TimelineRail className="space-y-7">
                            {positions.map((position, posIdx) => (
                                <PositionRow
                                    key={`${index}-${posIdx}`}
                                    id={String(posIdx)}
                                    position={position}
                                    display={display}
                                />
                            ))}
                        </TimelineRail>
                    ) : (
                        headerPosition?.description && (
                            <div className="mt-3">
                                <Markdown>{headerPosition.description}</Markdown>
                            </div>
                        )
                    )}
                    {item.type && <div className="mt-3">{`🏢 ${t('common:companyType')}: ${item.type}`}</div>}
                </>
            )}
        </TimelineEntry>
    );
};

export default EmploymentItem;
