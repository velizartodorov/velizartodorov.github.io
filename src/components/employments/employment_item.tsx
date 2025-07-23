import { Accordion, Col, Container, Row } from "react-bootstrap";
import { bullet, getImageUrl } from "../common/utils";
import { display } from "./utils";
import { Employment } from "./employment";

const EmploymentItem: React.FC<{ employment: Employment; eventKey: string }> = ({ employment, eventKey }) => (
    <Accordion.Item eventKey={eventKey}>
        <Accordion.Header>
            <Container fluid>
                <Row className="align-items-center">
                    <Col xs="auto" className="text-left">
                        <img src={getImageUrl(employment.icon)} alt="company icon" width="30" />
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
            <br /><br />
            {employment.description.map((bodyItem, idx) => (
                <span key={idx}>
                    {bodyItem}
                    <br />
                </span>
            ))}
            {employment.references.map((link) => (
                <div key={link.href}>
                    <span>{bullet()} </span>
                    <a href={link.href}>{link.value}</a>
                    <br />
                </div>
            ))}
        </Accordion.Body>
    </Accordion.Item>
);

export default EmploymentItem;