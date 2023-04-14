import { Accordion, Col, Container, Row } from "react-bootstrap";
import { employments } from "./EmploymentsDto";
import { monthDiff } from "./Utils";

const Employments = () => (
   <><h1>Employments</h1>
      <Accordion>
         {employments.map((employment, index) => (
            <Accordion.Item eventKey={index.toString()}>
               <Accordion.Header>
                  <Container fluid>
                     <Row>
                        <Col className="col-4 text-left">
                           <h2>{employment.position} at {employment.company}</h2>
                        </Col>
                        <Col className="col-md-auto text-left">
                           <img src={employment.icon} style={{ width: 50 }}></img>
                        </Col>
                        <Col>
                           {employment.place}
                        </Col>
                        <Col className="col-md-auto text-right">
                           <h4>{employment.period}{' '}
                              ({monthDiff(new Date(2017, 4), new Date(2018, 4))}
                              {' '}months)
                           </h4>
                        </Col>
                     </Row>
                  </Container>
               </Accordion.Header>
               <Accordion.Body><h4>{employment.body}</h4></Accordion.Body>
            </Accordion.Item>
         ))}
      </Accordion></>
)

export default Employments;