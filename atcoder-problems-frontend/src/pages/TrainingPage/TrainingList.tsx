import React from "react";
import { Container, Row, Button, Jumbotron, Badge, Progress } from "reactstrap";
import { Link, useRouteMatch } from "react-router-dom";
import { Course } from "../../interfaces/Course";
import Submission from "../../interfaces/Submission";
import { isAccepted } from "../../utils";

const formatPercent = (ratio: number): number => {
  return Math.round(ratio * 10000) / 100;
};

interface Props {
  courses: Course[];
  submissions: Submission[];
}

export const TrainingList: React.FC<Props> = (props) => {
  const solvedSet = props.submissions
    .filter((s) => isAccepted(s.result))
    .reduce((set, s) => {
      set.add(s.problem_id);
      return set;
    }, new Set<string>());

  const { url } = useRouteMatch();
  return (
    <Container fluid>
      <Row>
        <h1>Training</h1>
      </Row>
      {props.courses.map((course, i) => {
        const totalProblemCount = course.set_list
          .map((set) => set.problems.length)
          .reduce((a, b) => a + b, 0);
        const totalSolvedCount = course.set_list
          .map(
            (set) =>
              set.problems.filter((p) => solvedSet.has(p.problem_id)).length
          )
          .reduce((a, b) => a + b, 0);
        const totalProgressPercent = formatPercent(
          totalSolvedCount / totalProblemCount
        );

        return (
          <Jumbotron key={i} fluid>
            <Container fluid>
              <h3 className="display-4">{course.title}</h3>
              <Progress striped color="success" value={totalProgressPercent}>
                {totalProgressPercent} %
              </Progress>
              <p className="lead">
                {course.set_list.length} sets /{" "}
                {course.set_list
                  .map((s) => s.problems.length)
                  .reduce((a, b) => a + b, 0)}{" "}
                problems
              </p>
              <ul>
                {course.set_list.map((set, j) => {
                  const solved = set.problems.filter((p) =>
                    solvedSet.has(p.problem_id)
                  ).length;
                  return (
                    <li key={j} className="lead">
                      {set.title}{" "}
                      <Badge>
                        {solved} / {set.problems.length}
                      </Badge>
                    </li>
                  );
                })}
              </ul>
              <p className="lead">
                <Button
                  size="lg"
                  color="success"
                  tag={Link}
                  to={`${url}/${course.title}`}
                >
                  Challenge
                </Button>
              </p>
            </Container>
          </Jumbotron>
        );
      })}
    </Container>
  );
};
