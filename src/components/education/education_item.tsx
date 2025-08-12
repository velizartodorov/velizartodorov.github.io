import { Accordion, Col, Container, Row } from 'react-bootstrap';
import { bullet } from '../common/utils';

import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Reference } from '../common/reference';
import { IEducation } from './education.init';
import { useDisplayPeriod } from './utils';

const EducationItem: FC<{ item: IEducation; index: number }> = ({ item, index }) => {
  const { t } = useTranslation();
  const atWord = t('common:period.at');
  const displayPeriod = useDisplayPeriod();
  return (
    <Accordion.Item eventKey={index.toString()}>
      <Accordion.Header>
        <Container fluid>
          <Row className="align-items-center">
            <Col xs="auto" className="text-left">
              <img src={item.icon} alt="education icon" width="30" />
            </Col>
            <Col xs={9} md={7} className="text-left">
              <h5 className="education-font">
                {`${item.occupation} ${atWord} ${item.institution}`}
              </h5>
            </Col>
            <Col className="d-none d-sm-block">{item.place}</Col>
            <Col xs="auto" className="text-right d-none d-sm-block">
              <h5>{displayPeriod(item.period)}</h5>
            </Col>
          </Row>
        </Container>
      </Accordion.Header>
      <Accordion.Body>
        {item.body.map((bodyItem: string, bodyIndex: number) => (
          <span key={`body-${index}-${bodyIndex}`}>
            {bodyItem}
            <br />
          </span>
        ))}
        {item.references.map((link: Reference, refIndex: number) => (
          <div key={`ref-${index}-${refIndex}`}>
            <span>{bullet} </span>
            <a href={link.href}>{link.value}</a>
          </div>
        ))}
      </Accordion.Body>
    </Accordion.Item>
  );
};
export default EducationItem;