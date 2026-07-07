import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { AccordionItem } from '../common/accordion';
import ItemHeaderRow from '../common/item_header_row';
import Markdown from '../common/markdown';
import { IEducation } from './education.init';
import { useDisplayPeriod } from './utils';

const EducationItem: FC<{ item: IEducation; index: number }> = ({ item, index }) => {
    const { t } = useTranslation();
    const atWord = t('common:period.at');
    const { display } = useDisplayPeriod();
    const header = (
        <ItemHeaderRow
            icon={{ src: item.icon, alt: 'education icon', className: 'w-[30px] rounded-lg' }}
            title={`${item.occupation} ${atWord} ${item.institution}`}
            titleClassName="w-9/12 text-left md:w-7/12"
            place={item.place}
            period={display(item.period)}
        />
    );
    return (
        <AccordionItem eventKey={index.toString()} header={header}>
            <Markdown>{item.body}</Markdown>
        </AccordionItem>
    );
};
export default EducationItem;
