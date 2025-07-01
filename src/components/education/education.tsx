import { Accordion, Card, Col, Container, Row } from "react-bootstrap";
import { v4 as uuidv4 } from 'uuid';
import { educations } from "./educations.init";
import './education.css'
import { display } from "./utils";
import { bullet, getImageUrl } from "../common/utils";

const Education = () => (
  <>
    <Accordion defaultActiveKey="1" className="mt-3 mx-4">
      <Accordion.Item eventKey="1">
        <Card>
          <Accordion.Header>
            <h4 className="px-2 mb-1">Education 🦉</h4>
          </Accordion.Header>
          <Accordion.Body>
            <Accordion>
              {educations.map((education, index) => (
                <Accordion.Item key={index} eventKey={index.toString()}>
                  <Accordion.Header>
                    <Container fluid>
                      <Row className="align-items-center">
                        <Col xs="auto" className="text-left">
                          <img src={getImageUrl(education.icon)}
                            alt="education icon"
                            width="30" />
                        </Col>
                        <Col xs={9} md={7} className="text-left">
                          <h5 className="education-font">{`${education.occupation} at ${education.institution}`}</h5>
                        </Col>
                        <Col className="d-none d-sm-block">{education.place}</Col>
                        <Col xs="auto" className="text-right d-none d-sm-block">
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