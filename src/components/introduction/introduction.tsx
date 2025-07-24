import { useTranslation } from 'react-i18next';
import AccordionWrapper from '../common/accordion_wrapper';
import { Properties } from '../common/properties';
import { useFormatBody } from './utils';

const Introduction = ({ className, eventKey }: Properties) => {
  const { t } = useTranslation();
  const body = useFormatBody(t('introduction:body', { returnObjects: true }));
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