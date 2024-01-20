import { Card } from "react-bootstrap";
import { introduction } from "./utils";

const Introduction = () => (
  <>
    <Card>
      <Card.Header><h2>Introduction</h2></Card.Header>
      <Card.Body>
        <Card.Text>
          {introduction}
        </Card.Text>
      </Card.Body>
    </Card>
  </>
);

export default Introduction;