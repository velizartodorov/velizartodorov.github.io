import { Accordion, Col, Container, Row } from 'react-bootstrap';
import { bullet, getImageUrl } from '../common/utils';

import { FC, useContext } from 'react';
import { IEducation } from './education.init';
import { Reference } from '../common/reference';
import { display } from './utils';
import { LanguageContext } from '../common/language_selector';
import enPeriod from '../common/lang.period.en.json';
import nlPeriod from '../common/lang.period.nl.json';

const EducationItem: FC<{ item: IEducation; index: number }> = ({ item, index }) => {
  const { language } = useContext(LanguageContext);
  const periodLang = language === 'nl' ? nlPeriod : enPeriod;
  const at = periodLang.period.at;
  return (
    <Accordion.Item eventKey={index.toString()}>
      <Accordion.Header>
        <Container fluid>
          <Row className="align-items-center">
            <Col xs="auto" className="text-left">
              <img src={getImageUrl(item.icon)} alt="education icon" width="30" />
            </Col>
            <Col xs={9} md={7} className="text-left">
              <h5 className="education-font">
                {`${item.occupation} ${at} ${item.institution}`}
              </h5>
            </Col>
            <Col className="d-none d-sm-block">{item.place}</Col>
            <Col xs="auto" className="text-right d-none d-sm-block">
              <h5>{display(item.period, language)}</h5>
            </Col>
          </Row>
        </Container>
      </Accordion.Header>
      <Accordion.Body>
        {item.body.map((bodyItem: string) => (
          <span key={index + '-' + bodyItem}>
            {bodyItem}
            <br />
          </span>
        ))}
        {item.references.map((link: Reference) => (
          <div key={link.href}>
            <span>{bullet()} </span>
            <a href={link.href}>{link.value}</a>
          </div>
        ))}
      </Accordion.Body>
    </Accordion.Item>
  );
};
export default EducationItem;