import { Accordion, Card } from 'react-bootstrap';
import { introductionBody } from './utils';

const Introduction = () => (
  <Accordion defaultActiveKey="0" className='mx-4'>
    <Accordion.Item eventKey="0">
      <Card>
        <Accordion.Header>
          <h4 className="px-2 mb-1">Introduction 👋</h4>
        </Accordion.Header>
        <Accordion.Body>
          {introductionBody}
        </Accordion.Body>
      </Card>
    </Accordion.Item>
  </Accordion>
);

export default Introduction;