import React from 'react';
import {Route, Switch} from "react-router-dom";
import Tutorial from "./tutorial";
import TutorialList from "./tutorialList";

const TutorialRoute = () => {
    return (
        <div>
            <Switch>
                <Route path="/tutorials/contestId=:contestId" component={TutorialList}/>
                <Route path="/tutorials/:tutorialId" component={Tutorial}/>
                <Route path="/tutorials" component={TutorialList}/>
            </Switch>
        </div>
    );
};

export default TutorialRoute;