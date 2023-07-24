import React from "react";
import { Route, Switch } from "react-router-dom";
import Tutorial from "./tutorial";
import TutorialList from "./tutorialList";
import { urls } from "../../configuration";
import AddEditTutorial from "./addEditTutorial";

const TutorialRoute = () => {
   return (
      <Switch>
         <Route path={`${urls.tutorials}/page=:page`} component={TutorialList} />
         <Route path={`${urls.addTutorial}`} component={AddEditTutorial} />
         <Route path={`${urls.editTutorial}/:id`} component={AddEditTutorial} />
         <Route path={`${urls.tutorials}/:tutorialId`} component={Tutorial} />
         <Route path={urls.tutorials} component={TutorialList} />
      </Switch>
   );
};

export default TutorialRoute;
