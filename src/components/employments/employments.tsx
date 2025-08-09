
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { Accordion } from 'react-bootstrap';
import AccordionWrapper from '../common/accordion_wrapper';
import { SectionProps } from '../common/section_props';
import EmploymentItem from './employment_item';
import './employments.css';
import { useEmployments } from './employments.init';

const Employments = ({ className, eventKey }: SectionProps) => {
  const { t, i18n } = useTranslation(['employments']);
  const employments = useEmployments();
  const [retryCount, setRetryCount] = useState(0);

  // Debug logging
  console.debug('Employments component render:', {
    employmentsLength: employments.length,
    employments: employments,
    i18nInitialized: i18n.isInitialized,
    hasEmploymentsBundle: i18n.hasResourceBundle(i18n.language, 'employments'),
    hasDatesBundle: i18n.hasResourceBundle(i18n.language, 'dates'),
    currentLanguage: i18n.language,
    retryCount
  });

  // Retry loading if employments are not available
  useEffect(() => {
    if (employments.length === 0 && i18n.isInitialized && retryCount < 3) {
      const timer = setTimeout(() => {
        console.debug(`Retrying employment loading (attempt ${retryCount + 1})`);
        setRetryCount(prev => prev + 1);
      }, 1000 * (retryCount + 1)); // Exponential backoff
      
      return () => clearTimeout(timer);
    }
  }, [employments.length, i18n.isInitialized, retryCount]);

  return (
    <AccordionWrapper title={t('employments:title')} eventKey={eventKey} className={className}>
      {/* Debug section */}
      <div className="p-3 border-bottom">
        <h6>Debug: Employment Data</h6>
        <small className="text-muted">
          <div>i18n initialized: {i18n.isInitialized ? 'Yes' : 'No'}</div>
          <div>Language: {i18n.language}</div>
          <div>Has employments: {i18n.hasResourceBundle(i18n.language, 'employments') ? 'Yes' : 'No'}</div>
          <div>Has dates: {i18n.hasResourceBundle(i18n.language, 'dates') ? 'Yes' : 'No'}</div>
          <div>Employments count: {employments.length}</div>
          <div>Retry count: {retryCount}</div>
          {employments.length > 0 && (
            <div>
              <div>First employment:</div>
              <pre>{JSON.stringify(employments[0], null, 2)}</pre>
            </div>
          )}
        </small>
      </div>
      
      {employments.length > 0 ? (
        <Accordion defaultActiveKey="0">
          {employments.map((item, index) => (
            <EmploymentItem item={item} index={index} eventKey={String(index)} key={index} />
          ))}
        </Accordion>
      ) : (
        <div className="text-center p-3">
          {!i18n.isInitialized ? (
            <div>
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p>Initializing i18n...</p>
            </div>
          ) : (
            <div>
              <p>No employment data available</p>
              <small className="text-muted">
                Debug: i18n initialized: {i18n.isInitialized ? 'Yes' : 'No'}, 
                Language: {i18n.language}, 
                Has employments: {i18n.hasResourceBundle(i18n.language, 'employments') ? 'Yes' : 'No'}, 
                Has dates: {i18n.hasResourceBundle(i18n.language, 'dates') ? 'Yes' : 'No'},
                Retry count: {retryCount}
              </small>
            </div>
          )}
        </div>
      )}
    </AccordionWrapper>
  );
};

export default Employments;