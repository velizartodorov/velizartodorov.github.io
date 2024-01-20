import { Accordion, Card, Col, Container, Row } from "react-bootstrap";
import { v4 as uuidv4 } from 'uuid';
import { employments as educations } from "./employments.init";
import { display, bullet as bullet } from "./utils";

const Education = () => (
  <>
    <Card>
      <Card.Header><h2>Education 🦉</h2></Card.Header>
      <Card.Body>
        <Accordion>
          {educations.map((education, index) => (
            <Accordion.Item key={index} eventKey={index.toString()}>
              <Accordion.Header>
                <Container fluid>
                  <Row className="align-items-center">
                    <Col xs="auto" className="text-left">
                      <img src={education.icon} alt="company icon" style={{ width: 50 }} />
                    </Col>
                    <Col xs="6" className="text-left">
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
      </Card.Body>
    </Card>
  </>
);

export default Education;