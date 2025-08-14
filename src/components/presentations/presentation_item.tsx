
import { FC } from 'react';
import { Col, ListGroup, Row } from 'react-bootstrap';
import { Presentation } from './presentation';

const PresentationItem: FC<{ item: Presentation; index: number }> = ({ item }) => {
  return (
    <ListGroup.Item
      as='a'
      href={item.link}
      rel='noopener noreferrer'
      className="p-10 list-group-item presentation-item"
    >
      <Row className="align-items-center">
        <Col xs="auto" className="text-left presentation-icon">
          <img
            src={item.icon}
            height="27"
            alt="presentation icon"
          />
        </Col>
        <Col xs={9} md={5} className="text-left">
          <h5 className="presentation-font mb-0">{item.name}</h5>
        </Col>
      </Row>
    </ListGroup.Item>
  );
};

export default PresentationItem;