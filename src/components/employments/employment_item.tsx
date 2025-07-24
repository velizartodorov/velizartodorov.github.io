import { FC } from 'react';
import { Accordion, Col, Container, Row } from "react-bootstrap";

import { useTranslation } from 'react-i18next';
import { bullet, getImageUrl } from "../common/utils";
import { Employment } from "./employment";
import { useDisplayPeriod } from './utils';

const EmploymentItem: FC<{ item: Employment; index: number; eventKey: string }> = ({ item, index, eventKey }) => {
    const { t } = useTranslation();
    const { display } = useDisplayPeriod();
    const at = t('common:period.at');
    return (
        <Accordion.Item eventKey={eventKey}>
            <Accordion.Header>
                <Container fluid>
                    <Row className="align-items-center">
                        <Col xs="auto" className="text-left">
                            <img src={getImageUrl(item.icon)} alt="company icon" width="30" />
                        </Col>
                        <Col xs={9} md={5} className="text-left">
                            <h5 className="employment-font">
                                {`${item.position} ${at} ${item.company}`}
                            </h5>
                        </Col>
                        <Col className="d-none d-sm-block d-md-block">
                            {item.place}
                        </Col>
                        <Col xs="auto" className="d-none d-sm-block text-right">
                            <h5 className="employment-font">
                                {display({
                                    start: new Date(item.period.start),
                                    end: new Date(item.period.end)
                                })}
                            </h5>
                        </Col>
                    </Row>
                </Container>
            </Accordion.Header>
            <Accordion.Body>
                <div className="mb-3">
                    {`🏢 ${t('common:companyType')}: ${item.type}`}
                </div>
                {item.description?.map((bodyItem: string, descIdx: number) => (
                    <span key={index + '-' + descIdx}>
                        {bodyItem}
                        <br />
                    </span>
                ))}
                {item.references?.map((link: any, refIdx: number) => (
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