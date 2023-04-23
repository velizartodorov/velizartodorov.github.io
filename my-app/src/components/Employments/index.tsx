import { Accordion, Col, Container, Row } from "react-bootstrap";
import { employments } from "./employments";

const Employments = () => (
  <>
    <h2>Employments</h2>
    <Accordion>
      {employments.map((employment, index) => (
        <Accordion.Item key={index} eventKey={index.toString()}>
          <Accordion.Header>
            <Container fluid>
              <Row>
                <Col className="col-md-auto text-left">
                  <img src={employment.icon} alt="company icon" style={{ width: 50 }} />
                </Col>
                <Col className="col-4 text-left">
                  <h5>{`${employment.position} at ${employment.company}`}</h5>
                </Col>
                <Col>{employment.place}</Col>
                <Col className="col-md-auto text-right">
                  <h5>{employment.period.period}</h5>
                </Col>
              </Row>
            </Container>
          </Accordion.Header>
          <Accordion.Body>{employment.body}</Accordion.Body>
        </Accordion.Item>
      ))}
    </Accordion>
  </>
);

export default Employments;