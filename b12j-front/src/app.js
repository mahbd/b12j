import "./app.css"
import React, {useContext, useState} from 'react';
import NavBar from "./apps/navBar";
import {Route, Switch} from "react-router-dom";
import {projectURLS} from "./configuration";
import ContestRoute from "./apps/contest/contestRoute";
import UserRoute from "./apps/user/userRoute";
import ProblemRoute from "./apps/problem/problemRoute";
import LoadingAnimation from "./common/loadingAnimation";

import SubmissionRoute from "./apps/submission/submissionRoute";
import TutorialRoute from "./apps/tutorial/tutorialRoute";
import SideBar from "./apps/sideBar";
import {SuperContext} from "./context";


const App = () => {

  return (
    <div>
      <LoadingAnimation/>
      <NavBar/>
      <SideBar/>
      <Switch>
        <Route path={projectURLS.contests} component={ContestRoute}/>
        {/*<Route path={projectURLS.problems} component={ProblemRoute}/>*/}
        {/*<Route path={projectURLS.submissions} component={SubmissionRoute}/>*/}
        {/*<Route path={projectURLS.tutorials} component={TutorialRoute}/>*/}
        {/*<Route path={projectURLS.user} component={UserRoute}/>*/}
      </Switch>
    </div>

  );
};

export default App;
