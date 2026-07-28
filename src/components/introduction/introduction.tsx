import { useTranslation } from 'react-i18next';
import Section from '../common/section';
import { Properties } from '../common/properties';
import { useFormatBody } from './utils';

const Introduction = ({ className, id }: Properties) => {
    const { t } = useTranslation();
    const body = useFormatBody(t('introduction:body', { returnObjects: true }));
    return (
        <Section title={t('introduction:title')} className={className} id={id}>
            {body}
        </Section>
    );
};

export default Introduction;
