import { FC } from 'react';
import { Accordion, Col, Container, Row } from "react-bootstrap";

import { useTranslation } from 'react-i18next';
import { bullet } from "../common/utils";
import { Employment } from "./employment";
import { combinedPeriod, useDisplayPeriod } from './utils';
import { Reference } from '../common/reference';

const EmploymentItem: FC<{ item: Employment; index: number; eventKey: string }> =
    ({ item, index, eventKey }) => {
        const { t } = useTranslation();
        const { display } = useDisplayPeriod();
        const positions = item.positions ?? [];
        const headerPosition = positions[0];
        const headerPlace = headerPosition?.place ?? '';
        const headerPeriod = combinedPeriod(positions);
        const at = t('common:period.at');
        const headerTitle = headerPosition
            ? `${headerPosition.position} ${at} ${item.company}`
            : '';

        return (
            <Accordion.Item eventKey={eventKey}>
                <Accordion.Header>
                    <Container fluid>
                        <Row className="align-items-center">
                            <Col xs="auto" className="text-left">
                                <img src={item.icon} alt="company icon" width="30" />
                            </Col>
                            <Col xs={9} md={5} className="text-left">
                                <h5 className="employment-font">
                                    {headerTitle}
                                </h5>
                            </Col>
                            <Col className="d-none d-sm-block d-md-block">
                                {headerPlace}
                            </Col>
                            <Col xs="auto" className="d-none d-sm-block text-right">
                                <h5 className="employment-font">
                                    {headerPeriod ? display(headerPeriod) : ''}
                                </h5>
                            </Col>
                        </Row>
                    </Container>
                </Accordion.Header>
                <Accordion.Body>
                    {item.type && (
                        <div className="mb-3">
                            {`🏢 ${t('common:companyType')}: ${item.type}`}
                        </div>
                    )}
                    <div className="positions-timeline">
                    {positions.map((position, posIdx) => {
                        const showTitle = positions.length > 1;
                        return (
                            <div key={`${index}-${posIdx}`} className="position-block">
                                {showTitle && (
                                    <>
                                        <h5 className="employment-font mb-1">
                                            {`${position.position}`}
                                        </h5>
                                        <div className="text-muted mb-2">
                                            {display({
                                                start: new Date(position.period.start),
                                                end: position.period.end ? new Date(position.period.end) : undefined
                                            })}
                                        </div>
                                    </>
                                )}
                                {position.description?.map((bodyItem: string, descIdx: number) => (
                                    <span key={`${index}-${posIdx}-${descIdx}`}>
                                        {bodyItem}
                                        <br />
                                    </span>
                                ))}
                                {position.references?.map((link: Reference, refIdx: number) => (
                                    <div key={`${link.href}-${refIdx}`}>
                                        <span>{bullet} </span>
                                        <a href={link.href}>{link.value}</a>
                                        <br />
                                    </div>
                                ))}
                            </div>
                        );
                    })}
                    </div>
                </Accordion.Body>
            </Accordion.Item>
        );
    };

export default EmploymentItem;
