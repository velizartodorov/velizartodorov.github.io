
import { useTranslation } from 'react-i18next';
import AccordionWrapper from '../common/accordion_wrapper';
import { Properties } from '../common/properties';
import { interpolate, totalYears, useTotalTime } from './utils';

const Introduction = ({ className, eventKey }: Properties) => {
  const { t } = useTranslation();
  const totalTime = useTotalTime();
  const bodyRaw = t('introduction:body', { returnObjects: true });
  const body = Array.isArray(bodyRaw)
    ? interpolate(bodyRaw.join(' '), { totalYears: totalYears(), totalTime })
    : interpolate(String(bodyRaw), { totalYears: totalYears(), totalTime });
  return (
    <AccordionWrapper title={t('introduction:title')} eventKey={eventKey} className={className}>
      {body}
    </AccordionWrapper>
  );
};

export default Introduction;
