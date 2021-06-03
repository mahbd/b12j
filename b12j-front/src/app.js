import "./app.css"
import React, {useContext, useState} from 'react';
import NavBar from "./apps/navBar";
import {Route, Switch, Redirect} from "react-router-dom";
import {urls} from "./configuration";
import ContestRoute from "./apps/contest/contestRoute";
import UserRoute from "./apps/user/userRoute";
import ProblemRoute from "./apps/problem/problemRoute";
import LoadingAnimation from "./common/loadingAnimation";

import SubmissionRoute from "./apps/submission/submissionRoute";
import TutorialRoute from "./apps/tutorial/tutorialRoute";
import {SuperContext} from "./context";
import LeftSideBar from "./apps/leftSideBar";
import RightSideBar from "./apps/rightSideBar";
import Home from "./apps/home";
import Footer from "./apps/footer";


const App = () => {
  const [refresh, setRefresh] = useState(false);
  const {userActs} = useContext(SuperContext);

  let unSub = userActs.store.subscribe(() => {
    setTimeout(() => {
      setRefresh(!refresh);
      unSub();
    }, 100)
  })

  return (
    <div className={"row"}>
      <LoadingAnimation/>
      <NavBar/>
      <div className={"col-auto"}>
        <LeftSideBar/>
      </div>
      <div className={"col"}>
        <Switch>
          <Route path={"/home"} component={Home}/>
          <Route path={urls.contests} component={ContestRoute}/>
          <Route path={urls.problems} component={ProblemRoute}/>
          <Route path={urls.submissions} component={SubmissionRoute}/>
          <Route path={urls.tutorials} component={TutorialRoute}/>
          <Route path={urls.user} component={UserRoute}/>
        </Switch>
      </div>
      <Route exact path={"/"}>
        <Redirect exact from={"/"} to={"/home"}/>
      </Route>
      <div className={"col-auto"}>
        <RightSideBar/>
      </div>
      <Footer />
    </div>

  );
};

export default App;
