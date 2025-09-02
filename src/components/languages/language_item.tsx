import { FC } from 'react';
import { Col, ListGroup, Row } from 'react-bootstrap';
import { Language } from './language';

const LanguageItem: FC<{ item: Language }> = ({ item }) => {
    return (
        <ListGroup.Item className="p-10 list-group-item language-item">
            <Row className="align-items-center">
                <Col xs="auto" className="text-left language-icon">
                    <img
                        src={item.icon}
                        height="27"
                        alt="language icon"
                    />
                </Col>
                <Col xs={4} className="text-left">
                    <h5 className="language-font mb-0">{item.label}</h5>
                </Col>
                <Col className="language-proficiency">
                    <span className="language-font">{item.proficiency}</span>
                </Col>
            </Row>
        </ListGroup.Item>
    );
};

export default LanguageItem;
