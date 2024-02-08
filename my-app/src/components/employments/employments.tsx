import { Accordion, Card, Col, Container, Row } from "react-bootstrap";
import { v4 as uuidv4 } from 'uuid';
import { employments } from "./employments.init";
import { bullet, display } from "./utils";

const Employments = () => (
  <>
    <Accordion defaultActiveKey="0" className="mt-4 mx-3">
      <Accordion.Item eventKey="0">
        <Card>
          <Accordion.Header><h3>Employments 💼</h3></Accordion.Header>
          <Accordion.Body>
            <Accordion>
              {employments.map((employment, index) => (
                <Accordion.Item key={index} eventKey={index.toString()}>
                  <Accordion.Header>
                    <Container fluid>
                      <Row className="align-items-center">
                        <Col xs="auto" className="text-left">
                          <img src={employment.icon} alt="company icon" style={{ width: 30 }} />
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
          </Accordion.Body>
        </Card>
      </Accordion.Item>
    </Accordion>
  </>
);

export default Employments;