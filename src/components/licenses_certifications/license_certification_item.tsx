import { FC } from 'react';
import { Col, ListGroup, Row } from 'react-bootstrap';

import { LicenseCertification } from './license_certification';
import { useTranslation } from 'react-i18next';

const LicenseCertificationItem: FC<{
  item: LicenseCertification; index: number
}> = ({ item }) => {
  const hasLink = Boolean(item.link?.trim());
  const { t } = useTranslation();
  const months = t('common:months', { returnObjects: true }) as string[];
  const date = item.date instanceof Date ? item.date : new Date(item.date);
  const month = date.getMonth();
  const year = date.getFullYear();
  const monthYearStr = `${months[month]} ${year}`;

  return (
    <ListGroup.Item
      as={hasLink ? 'a' : 'div'}
      href={hasLink ? item.link : undefined}
      rel={hasLink ? 'noopener noreferrer' : undefined}
      className="p-10 list-group-item license-item"
    >
      <Row className="align-items-center">
        <Col xs="auto" className="text-left license-icon">
          <img
            src={item.icon}
            height="25"
            width="30"
            alt="license icon"
          />
        </Col>
        <Col xs={9} md={5} className="text-left">
          <h5 className="license-font mb-0">{item.name}</h5>
        </Col>
        <Col className="text-left d-none d-sm-block ps-0">
          {item.institution}
        </Col>
        <Col xs="auto" className="text-end d-none d-sm-block pe-5">
          <h5>{monthYearStr}</h5>
        </Col>
      </Row>
    </ListGroup.Item>
  );
};

export default LicenseCertificationItem;
