import { Accordion, Col, Container, Row } from "react-bootstrap";
import { employments } from "./employments";
import { display } from "./utils";

const Employments = () => (
  <>
    <h2>Employments</h2>
    <Accordion>
      {employments.map((employment, index) => (
        <Accordion.Item key={index} eventKey={index.toString()}>
          <Accordion.Header>
            <Container fluid>
              <Row className="align-items-center">
                <Col xs="auto" className="text-left">
                  <img src={employment.icon} alt="company icon" style={{ width: 50 }} />
                </Col>
                <Col xs="4" className="text-left">
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
              <a>{bodyItem}<br></br></a>
            ))}
             {employment.references.map((link) => (
             <a href={link}>{link}<br></br></a>
            ))}
          </Accordion.Body>
        </Accordion.Item>
      ))}
    </Accordion>
  </>
);

export default Employments;