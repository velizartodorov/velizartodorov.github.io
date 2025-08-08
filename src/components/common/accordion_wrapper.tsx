import { FC } from 'react';
import { Accordion, Card } from 'react-bootstrap';
import './accordion_wrapper.css';
import { Properties } from './properties';

const AccordionWrapper: FC<Properties> = ({ title, children, className = '', eventKey = '0' }) => (
  <Accordion defaultActiveKey={eventKey} className={className}>
    <Accordion.Item eventKey={eventKey}>
      <Card>
        <Accordion.Header>
          <h4 className="mb-1 accordion-heading">{title}</h4>
        </Accordion.Header>
        <Accordion.Body>
          <Accordion>
            {children}
          </Accordion>
        </Accordion.Body>
      </Card>
    </Accordion.Item>
  </Accordion>
);

export default AccordionWrapper;