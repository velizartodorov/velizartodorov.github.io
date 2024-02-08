import { Accordion, Card, Col, Container, Row } from "react-bootstrap";
import { v4 as uuidv4 } from 'uuid';
import { educations } from "./educations.init";
import { display, bullet } from "./utils";

const Education = () => (
  <>
    <Accordion defaultActiveKey="1" className="mt-4">
      <Accordion.Item eventKey="1">
        <Card>
          <Accordion.Header><h3>Education 🦉</h3></Accordion.Header>
          <Accordion.Body>
            <Accordion>
              {educations.map((education, index) => (
                <Accordion.Item key={index} eventKey={index.toString()}>
                  <Accordion.Header>
                    <Container fluid>
                      <Row className="align-items-center">
                        <Col xs="auto" className="text-left">
                          <img src={education.icon} alt="education icon" style={{ width: 30 }} />
                        </Col>
                        <Col xs="7" className="text-left">
                          <h5>{`${education.occupation} at ${education.institution}`}</h5>
                        </Col>
                        <Col>{education.place}</Col>
                        <Col xs="auto" className="text-right">
                          <h5>{display(education.period)}</h5>
                        </Col>
                      </Row>
                    </Container>
                  </Accordion.Header>
                  <Accordion.Body>
                    {education.body.map((bodyItem) => (
                      <span key={uuidv4()}>{bodyItem}<br></br></span>
                    ))}
                    {education.references.map((link) => (
                      <div key={uuidv4()}>
                        <span>{bullet()} </span>
                        <a href={link.href}>{link.value}</a><br />
                      </div>
                    ))}
                  </Accordion.Body>
                </Accordion.Item>
              ))}
            </Accordion>
          </Accordion.Body>
        </Card>
      </Accordion.Item>
    </Accordion>
  </>
);

export default Education;