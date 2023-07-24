import React from "react";
import { Switch, Route } from "react-router-dom";
import ProblemList from "./problemList";
import { urls } from "../../configuration";
import Problem from "./problem";
import AddEditProblem from "./addEditProblem";
import AddTestCase from "./addTestCase";
import TestCaseList from "./testCaseList";

const ProblemRoute = () => {
  return (
    <Switch>
      <Route path={`${urls.problems}/page=:page`} component={ProblemList} />
      <Route path={`${urls.problems}/contest=:contestId/:problemId`} component={Problem} />
      <Route path={`${urls.addTestCases}/:problemId`} component={AddTestCase} />
      <Route path={`${urls.testCases}/:problemId`} component={TestCaseList} />
      <Route path={`${urls.addProblem}`} component={AddEditProblem} />
      <Route path={`${urls.editProblem}/:id`} component={AddEditProblem} />
      <Route path={`${urls.problems}/:problemId`} component={Problem} />
      <Route path={urls.problems} component={ProblemList} />
    </Switch>
  );
};

export default ProblemRoute;
