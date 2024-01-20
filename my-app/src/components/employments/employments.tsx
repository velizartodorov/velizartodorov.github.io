import { Accordion, Card, Col, Container, Row } from "react-bootstrap";
import { v4 as uuidv4 } from 'uuid';
import { employments } from "./employments.init";
import { bullet, display } from "./utils";

const Employments = () => (
  <>
    <Card>
      <Card.Header><h2>Employments 💼</h2></Card.Header>
      <Card.Body>
        <Accordion>
          {employments.map((employment, index) => (
            <Accordion.Item key={index} eventKey={index.toString()}>
              <Accordion.Header>
                <Container fluid>
                  <Row className="align-items-center">
                    <Col xs="auto" className="text-left">
                      <img src={employment.icon} alt="company icon" style={{ width: 50 }} />
                    </Col>
                    <Col xs="5" className="text-left">
                      <h5>{`${employment.position} at ${employment.company}`}</h5>
                    </Col>
                    <Col>{employment.place}</Col>
                    <Col xs="auto" className="text-right">
                      <h5>{display(employment.period)}</h5>
                    </Col>
                  </Row>
                </Container>
              </Accordion.Header>
              <Accordion.Body>
                {employment.body.map((bodyItem) => (
                  <span key={uuidv4()}>{bodyItem}<br></br></span>
                ))}
                {employment.references.map((link) => (
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

export default Employments;