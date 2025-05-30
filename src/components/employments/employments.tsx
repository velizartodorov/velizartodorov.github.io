import { Accordion, Card, Col, Container, Row } from "react-bootstrap";
import { v4 as uuidv4 } from 'uuid';
import { employments } from "./employments.init";
import { bullet } from "../common/utils";
import { display } from "./utils";
import './employments.css';

const Employments = () => (
  <>
    <Accordion defaultActiveKey="0" className="mt-3 mx-4">
      <Accordion.Item eventKey="0">
        <Card>
          <Accordion.Header>
            <h4 className="px-2">Employments 💼</h4>
          </Accordion.Header>
          <Accordion.Body>
            <Accordion>
              {employments.map((employment, index) => (
                <Accordion.Item key={index} eventKey={index.toString()}>
                  <Accordion.Header>
                    <Container fluid>
                      <Row className="align-items-center">
                        <Col xs="auto" className="text-left">
                          <img src={process.env.PUBLIC_URL + employment.icon}
                            alt="company icon"
                            className='w-30' />
                        </Col>
                        <Col xs={9} md={5} className="text-left">
                          <h5 className="employment-font">
                            {`${employment.position} at ${employment.company}`}
                          </h5>
                        </Col>
                        <Col className="d-none d-sm-block d-md-block">
                          {employment.place}
                        </Col>
                        <Col xs="auto" className="d-none d-sm-block text-right">
                          <h5 className="employment-font">
                            {display(employment.period)}
                          </h5>
                        </Col>
                      </Row>
                    </Container>
                  </Accordion.Header>
                  <Accordion.Body>
                    Company type: {employment.type} 🏢
                    <br></br><br></br>
                    {employment.description.map((bodyItem) => (
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