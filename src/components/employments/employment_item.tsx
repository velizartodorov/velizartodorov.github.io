import { FC } from 'react';
import { Accordion, Col, Container, Row } from "react-bootstrap";
import { bullet, getImageUrl } from "../common/utils";
import { display } from "./utils";
import { Employment } from "./employment";

const EmploymentItem: FC<{ item: Employment; index: number; eventKey: string }> = ({ item, index, eventKey }) => (
    <Accordion.Item eventKey={eventKey}>
        <Accordion.Header>
            <Container fluid>
                <Row className="align-items-center">
                    <Col xs="auto" className="text-left">
                        <img src={getImageUrl(item.icon)} alt="company icon" width="30" />
                    </Col>
                    <Col xs={9} md={5} className="text-left">
                        <h5 className="employment-font">
                            {`${item.position} at ${item.company}`}
                        </h5>
                    </Col>
                    <Col className="d-none d-sm-block d-md-block">
                        {item.place}
                    </Col>
                    <Col xs="auto" className="d-none d-sm-block text-right">
                        <h5 className="employment-font">
                            {display(item.period)}
                        </h5>
                    </Col>
                </Row>
            </Container>
        </Accordion.Header>
        <Accordion.Body>
            Company type: {item.type} 🏢
            <br /><br />
            {item.description.map((bodyItem: string) => (
                <span key={index + '-' + bodyItem}>
                    {bodyItem}
                    <br />
                </span>
            ))}
            {item.references.map((link) => (
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