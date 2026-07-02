import { bullet } from '../common/utils';

import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { AccordionItem } from '../common/accordion';
import { Reference } from '../common/reference';
import { IEducation } from './education.init';
import { useDisplayPeriod } from './utils';

const EducationItem: FC<{ item: IEducation; index: number }> = ({ item, index }) => {
  const { t } = useTranslation();
  const atWord = t('common:period.at');
  const { display } = useDisplayPeriod();
  const header = (
    <div className="flex w-full items-center gap-3">
      <div className="shrink-0 text-left">
        <img src={item.icon} alt="education icon" className="w-[30px]" />
      </div>
      <div className="w-9/12 text-left md:w-7/12">
        <h5 className="mb-0 text-xl max-sm:text-base max-sm:font-normal">
          {`${item.occupation} ${atWord} ${item.institution}`}
        </h5>
      </div>
      <div className="hidden flex-1 sm:block">{item.place}</div>
      <div className="hidden shrink-0 text-right sm:block">
        <h5 className="mb-0 text-xl">{display(item.period)}</h5>
      </div>
    </div>
  );
  return (
    <AccordionItem eventKey={index.toString()} header={header}>
      {item.body.map((bodyItem: string, bodyIndex: number) => (
        <span key={`body-${index}-${bodyIndex}`}>
          {bodyItem}
          <br />
        </span>
      ))}
      {item.references.map((link: Reference, refIndex: number) => (
        <div key={`ref-${index}-${refIndex}`}>
          <span>{bullet} </span>
          <a href={link.href}>{link.value}</a>
        </div>
      ))}
    </AccordionItem>
  );
};
export default EducationItem;