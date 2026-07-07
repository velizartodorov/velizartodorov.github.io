import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { AccordionItem } from '../common/accordion';
import Icon from '../common/icon';
import ItemTitle from '../common/item_title';
import Markdown from '../common/markdown';
import { IEducation } from './education.init';
import { useDisplayPeriod } from './utils';

const EducationItem: FC<{ item: IEducation; index: number }> = ({ item, index }) => {
    const { t } = useTranslation();
    const atWord = t('common:period.at');
    const { display } = useDisplayPeriod();
    const header = (
        <div className="flex w-full items-center gap-3">
            <div className="shrink-0 text-left">
                <Icon src={item.icon} alt="education icon" className="w-[30px] rounded-lg" />
            </div>
            <div className="w-9/12 text-left md:w-7/12">
                <ItemTitle>{`${item.occupation} ${atWord} ${item.institution}`}</ItemTitle>
            </div>
            <div className="hidden flex-1 sm:block">{item.place}</div>
            <div className="hidden shrink-0 text-right sm:block">
                <ItemTitle>{display(item.period)}</ItemTitle>
            </div>
        </div>
    );
    return (
        <AccordionItem eventKey={index.toString()} header={header}>
            <Markdown>{item.body}</Markdown>
        </AccordionItem>
    );
};
export default EducationItem;
