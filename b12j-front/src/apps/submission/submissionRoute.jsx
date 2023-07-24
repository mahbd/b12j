import React from "react";
import { Route, Switch } from "react-router-dom";
import SubmissionList from "./submissionList";
import Submission from "./submission";
import { urls } from "../../configuration";

const SubmissionRoute = () => {
   return (
      <Switch>
         <Route path={`${urls.submissions}/page=:page`} component={SubmissionList} />
         <Route path={`${urls.submissions}/:submissionId`} component={Submission} />
         <Route path={urls.submissions} component={SubmissionList} />
      </Switch>
   );
};

export default SubmissionRoute;
