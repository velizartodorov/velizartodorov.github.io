import { FC } from 'react';
import { Col, ListGroup, Row } from 'react-bootstrap';
import { getImageUrl, monthYear } from '../common/utils';
import { LicenseCertification } from './license_certification';

const LicenseCertificationItem: FC<{
  item: LicenseCertification; index: number
}> = ({ item }) => {
  const hasLink = Boolean(item.link?.trim());

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
            src={getImageUrl(item.icon)}
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
          <h5>{monthYear(item.date)}</h5>
        </Col>
      </Row>
    </ListGroup.Item>
  );
};

export default LicenseCertificationItem;
