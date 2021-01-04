import React from 'react';
import {Route, Switch} from "react-router-dom";
import SubmissionList from "./submissionList";
import Submission from "./submission";

const SubmissionRoute = () => {
    return (
        <Switch>
            <Route path="/submissions/page=:page" component={SubmissionList} />
            <Route path="/submissions/:submissionId" component={Submission} />
            <Route path="/submissions" component={SubmissionList} />
        </Switch>
    );
};

export default SubmissionRoute;