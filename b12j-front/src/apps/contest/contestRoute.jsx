import React, {useContext, useState} from 'react';
import {Switch, Route} from "react-router-dom";
import {urls} from "../../configuration";
import ContestList from "./contestList";
import Contest from "./contest";
import Standing from "./standing";
import {SuperContext} from "../../context";

const ContestRoute = () => {
  return <Switch>
    <Route path="/contests/standing/:contestId" component={Standing}/>
    <Route path="/contests/:contestId" component={Contest}/>
    <Route path={urls.contests} component={ContestList}/>
  </Switch>
};

export default ContestRoute;