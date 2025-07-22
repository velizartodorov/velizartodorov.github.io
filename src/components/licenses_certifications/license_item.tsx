import { Col, ListGroup, Row } from 'react-bootstrap';
import { getImageUrl, monthYear } from '../common/utils';
import { LicenseCertification } from './license_certification';

const LicenseItem: React.FC<{ license: LicenseCertification }> = ({ license }) => {
  const hasLink = license.link?.trim();
  const Wrapper: any = hasLink ? 'a' : 'div';
  return (
    <ListGroup.Item
      as={Wrapper}
      href={hasLink || undefined}
      rel={hasLink ? 'noopener noreferrer' : undefined}
      className="p-10 list-group-item license-item"
    >
      <Row className="align-items-center">
        <Col xs="auto" className="text-left license-icon">
          <img src={getImageUrl(license.icon)}
            height="25"
            alt="license icon"
            width="30" />
        </Col>
        <Col xs={9} md={5} className="text-left">
          <h5 className="license-font mb-0">
            {license.name}
          </h5>
        </Col>
        <Col className="text-left d-none d-sm-block ps-0">
          {license.institution}
        </Col>
        <Col xs="auto" className="text-end d-none d-sm-block pe-5">
          <h5>{monthYear(license.date)}</h5>
        </Col>
      </Row>
    </ListGroup.Item>
  );
};

export default LicenseItem;
