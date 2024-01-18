import { Card } from "react-bootstrap";
import { currentDate } from "../Employments/utils";
import { yearsDiff } from "./utils";

const Introduction = () => (
  <>
    <Card>
      <Card.Header><h2>Introduction</h2></Card.Header>
      <Card.Body>
        <Card.Text>
          I am software developer with {yearsDiff(new Date(2017, 6), currentDate())} experience in the industry. My experience is mainly in the Java technological stack, but my interests are also aimed towards the front-end. I'm also interested in setting-up correct Gitflows, so that the whole software team can function properly.
        </Card.Text>
      </Card.Body>
    </Card>
  </>
);

export default Introduction;