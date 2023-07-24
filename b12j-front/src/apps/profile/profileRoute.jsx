import React from "react";
import { NavLink, Redirect, Route, Switch } from "react-router-dom";
import { urls } from "../../configuration";
import Profile from "./profile";
import UnsolvedProblems from "./unsolvedProblems";
import ProfileTutorials from "./profileTutorials";
import UserProblems from "./userProblems";
import UserSubmissions from "./userSubmissions";
import ProfileContest from "./profileContest";
import TestProblems from "./testProblems";

const ProfileRoute = () => {
  return (
    <div>
      <ProfileNav />
      <Switch>
        <Route path={urls.testProblems} component={TestProblems} />
        <Route path={urls.profileTutorials} component={ProfileTutorials} />
        <Route path={urls.profileContests} component={ProfileContest} />
        <Route path={urls.profileSubmissions} component={UserSubmissions} />
        <Route path={urls.profileProblems} component={UserProblems} />
        <Route path={urls.unsolvedProblems} component={UnsolvedProblems} />
        <Route path={urls.profile} component={Profile} />
      </Switch>
      <Route exact path={urls.profile}>
        <Redirect exact from={urls.profile} to={urls.mainProfile} />
      </Route>
    </div>
  );
};

export default ProfileRoute;

const ProfileNav = () => {
  return <nav className={"navbar navbar-expand bg-white d-inline"} id={"navBar2"}>
    <ul className="navbar-nav row">
      <li className="nav-item col-auto m-1">
        <NavLink className="nav-link btn-sm fw-bold btn-outline-dark border-0" to={urls.mainProfile}>
          Main
        </NavLink>
      </li>
      <li className="nav-item col-auto m-1">
        <NavLink className="nav-link btn-sm fw-bold btn-outline-dark border-0" to={urls.unsolvedProblems}>
          Unsolved Problems
        </NavLink>
      </li>
      <li className="nav-item col-auto m-1">
        <NavLink className="nav-link btn-sm fw-bold btn-outline-dark border-0" to={urls.profileTutorials}>
          Tutorials
        </NavLink>
      </li>
      <li className="nav-item col-auto m-1">
        <NavLink className="nav-link btn-sm fw-bold btn-outline-dark border-0" to={urls.profileProblems}>
          Problems
        </NavLink>
      </li>
      <li className="nav-item col-auto m-1">
        <NavLink className="nav-link btn-sm fw-bold btn-outline-dark border-0" to={urls.profileSubmissions}>
          Submissions
        </NavLink>
      </li>
      <li className="nav-item col-auto m-1">
        <NavLink className="nav-link btn-sm fw-bold btn-outline-dark border-0" to={urls.profileContests}>
          Contests
        </NavLink>
      </li>
      <li className="nav-item col-auto m-1">
        <NavLink className="nav-link btn btn-sm fw-bold btn-outline-dark border-0" to={urls.testProblems}>
          Testable Problems
        </NavLink>
      </li>
    </ul>
  </nav>;
};