import "./index.css";
import React, { useContext, useState } from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import { urls } from "./configuration";
import UserRoute from "./apps/user/userRoute";

import { SuperContext } from "./context";
import Home from "./apps/others/home";
import Footer from "./apps/others/footer";
import ContestRoute from "./apps/contest/contestRoute";
import ProblemRoute from "./apps/problem/problemRoute";
import NavBar from "./apps/others/navBar";
import SubmissionRoute from "./apps/submission/submissionRoute";
import OthersRoute from "./apps/others/othersRoute";
import LeftSideBar from "./apps/others/leftSideBar";
import RightSideBar from "./apps/others/rightSideBar";
import TutorialRoute from "./apps/tutorial/tutorialRoute";
import ProfileRoute from "./apps/profile/profileRoute";

const App = () => {
  const [refresh, setRefresh] = useState(false);
  const { userActs } = useContext(SuperContext);

  let unSub = userActs.store.subscribe(() => {
    setTimeout(() => {
      setRefresh(!refresh);
      unSub();
    }, 20);
  });

  return (
    <div>
      <NavBar />
      <Switch>
        <Route path={urls.home} component={Home} />
        <div className={"row"}>
          <div className={" d-none d-lg-block float-start m-2"} style={{ width: "240px" }}>
            <LeftSideBar />
          </div>
          <div className={"col"}>
            <Switch>
              <Route path={urls.contests} component={ContestRoute} />
              <Route path={urls.problems} component={ProblemRoute} />
              <Route path={urls.others} component={OthersRoute} />
              <Route path={urls.submissions} component={SubmissionRoute} />
              <Route path={urls.tutorials} component={TutorialRoute} />
              <Route path={urls.profile} component={ProfileRoute} />
              <Route path={urls.users} component={UserRoute} />
            </Switch>
          </div>
          <div className={"col-2 d-none d-xxl-block float-end"}>
            <RightSideBar />
          </div>
        </div>
      </Switch>
      <Route exact path={"/"}>
        <Redirect exact from={"/"} to={"/home"} />
      </Route>
      <Footer />
    </div>
  );
};

export default App;
