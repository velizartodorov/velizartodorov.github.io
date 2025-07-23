import { Accordion, Col, Container, Row } from 'react-bootstrap';
import { v4 as uuidv4 } from 'uuid';
import { bullet, getImageUrl } from '../common/utils';
import { display } from './utils';

import { FC } from 'react';
import { IEducation } from './education.init';
import { Reference } from '../common/reference';

const EducationItem: FC<{ education: IEducation; index: number }> = ({ education, index }) => (
  <Accordion.Item eventKey={index.toString()}>
    <Accordion.Header>
      <Container fluid>
        <Row className="align-items-center">
          <Col xs="auto" className="text-left">
            <img src={getImageUrl(education.icon)} alt="education icon" width="30" />
          </Col>
          <Col xs={9} md={7} className="text-left">
            <h5 className="education-font">
              {`${education.occupation} at ${education.institution}`}
            </h5>
          </Col>
          <Col className="d-none d-sm-block">{education.place}</Col>
          <Col xs="auto" className="text-right d-none d-sm-block">
            <h5>{display(education.period)}</h5>
          </Col>
        </Row>
      </Container>
    </Accordion.Header>
    <Accordion.Body>
      {education.body.map((bodyItem: string) => (
        <span key={uuidv4()}>
          {bodyItem}
          <br />
        </span>
      ))}
      {education.references.map((link: Reference) => (
        <div key={uuidv4()}>
          <span>{bullet()} </span>
          <a href={link.href}>{link.value}</a>
          <br />
        </div>
      ))}
    </Accordion.Body>
  </Accordion.Item>
);

export default EducationItem;