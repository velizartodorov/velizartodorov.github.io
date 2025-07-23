import { FC, useContext } from 'react';
import { Accordion, Col, Container, Row } from "react-bootstrap";

import { bullet, getImageUrl } from "../common/utils";
import { Employment } from "./employment";
import enData from './lang.en.json';
import nlData from './lang.nl.json';
import { LanguageContext } from '../common/language_selector';
import { useDisplayPeriod } from './utils';
import enCommon from '../common/common.en.json';
import nlCommon from '../common/common.nl.json';


const EmploymentItem: FC<{ item: Employment; index: number; eventKey: string }> = ({ item, index, eventKey }) => {
    const { language } = useContext(LanguageContext);
    const data = language === 'nl' ? nlData : enData;
    const employmentKeys = Object.keys(data.employments);
    const employmentKey = employmentKeys[index];
    const langEmployment = data.employments[employmentKey as keyof typeof data.employments] || item;
    const { display } = useDisplayPeriod();
    const commonLang = language === 'nl' ? nlCommon.period : enCommon.period;
    return (
        <Accordion.Item eventKey={eventKey}>
            <Accordion.Header>
                <Container fluid>
                    <Row className="align-items-center">
                        <Col xs="auto" className="text-left">
                            <img src={getImageUrl(langEmployment.icon)} alt="company icon" width="30" />
                        </Col>
                        <Col xs={9} md={5} className="text-left">
                            <h5 className="employment-font">
                                {`${langEmployment.position} ${commonLang.at} ${langEmployment.company}`}
                            </h5>
                        </Col>
                        <Col className="d-none d-sm-block d-md-block">
                            {langEmployment.place}
                        </Col>
                        <Col xs="auto" className="d-none d-sm-block text-right">
                            <h5 className="employment-font">
                                {display({
                                    start: new Date(langEmployment.period.start),
                                    end: new Date(langEmployment.period.end)
                                })}
                            </h5>
                        </Col>
                    </Row>
                </Container>
            </Accordion.Header>
            <Accordion.Body>
                {langEmployment.description.map((bodyItem: string, descIdx: number) => (
                    <span key={index + '-' + descIdx}>
                        {bodyItem}
                        <br />
                    </span>
                ))}
                {langEmployment.references.map((link: any, refIdx: number) => (
                    <div key={link.href + '-' + refIdx}>
                        <span>{bullet()} </span>
                        <a href={link.href}>{link.value}</a>
                        <br />
                    </div>
                ))}
            </Accordion.Body>
        </Accordion.Item>
    );
};

export default EmploymentItem;