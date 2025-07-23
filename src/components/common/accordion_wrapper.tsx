import { FC } from 'react';
import { Accordion, Card } from 'react-bootstrap';
import { Properties } from './properties';

const AccordionWrapper: FC<Properties> = ({ title, children, className = '', eventKey = '0' }) => (
  <Accordion defaultActiveKey={eventKey} className={className}>
    <Accordion.Item eventKey={eventKey}>
      <Card>
        <Accordion.Header>
          <h4 className="px-2 mb-1">{title}</h4>
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