import React from 'react';
import {Switch, Route} from 'react-router-dom';
import ProblemList from "./problemList";
import Problem from "./problem";
import ProblemForm from "./problemForm";

const ProblemRoute = () => {
  return (
    <Switch>
      <Route path="/problems/contestId=:contestId" component={ProblemList}/>
      <Route path="/problems/add/:contestId" component={ProblemForm}/>
      <Route path="/problems/edit/:problemId" component={ProblemForm}/>
      <Route path={'/problems/:problemId'} component={Problem}/>
      <Route path={'/problems/'} component={ProblemList}/>
    </Switch>
  );
};

export default ProblemRoute;