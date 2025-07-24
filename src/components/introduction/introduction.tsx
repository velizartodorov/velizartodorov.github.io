import { useTranslation } from 'react-i18next';
import AccordionWrapper from '../common/accordion_wrapper';
import { Properties } from '../common/properties';
import { interpolate, useIntroductionStats } from './utils';

const Introduction = ({ className, eventKey }: Properties) => {
  const { t } = useTranslation();
  const { totalTime, totalYears } = useIntroductionStats();
  const bodyRaw = t('introduction:body', { returnObjects: true });
  const body = Array.isArray(bodyRaw)
    ? interpolate(bodyRaw.join(' '), { totalTime, totalYears })
    : interpolate(String(bodyRaw), { totalTime, totalYears });
  return (
    <AccordionWrapper
      title={t('introduction:title')}
      eventKey={eventKey}
      className={className}>
      {body}
    </AccordionWrapper>
  );
};

export default Introduction;