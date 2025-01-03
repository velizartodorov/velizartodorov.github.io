import { Accordion, Card } from 'react-bootstrap';
import './introduction.css';
import { totalTime, totalYears } from './utils';

const Introduction = () => (
  <Accordion defaultActiveKey="0" className='mx-3'>
    <Accordion.Item eventKey="0">
      <Card>
        <Accordion.Header>
          <h4 className="px-2">Introduction 👋</h4>
        </Accordion.Header>
        <Accordion.Body>As a software developer with {totalYears()} years of experience ({totalTime()} 😅) in the industry, my passion lies in the Java technological stack. However, I have also gained expertise in front-end frameworks such as Angular. In addition to my daily development tasks, I prioritize following best practices, documenting project flow, extracting and translating business requirements into technical ones. Additionally, I am committed to monitoring version control systems and fostering effective team collaboration.</Accordion.Body>
      </Card>
    </Accordion.Item>
  </Accordion>
);

export default Introduction;