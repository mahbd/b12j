import React, {useEffect} from 'react';
import storeFunc from "./store/configureStore";
import NavBar from "./apps/navBar";
import {Route, Switch} from "react-router-dom";
import {apiEndpoint, projectURLS, wssURL} from "./configuration";
import ContestRoute from "./apps/contest/contestRoute";
import UserRoute from "./apps/user/userRoute";
import ProblemRoute from "./apps/problem/problemRoute";
import LoadingAnimation from "./common/loadingAnimation";
import ReconnectingWebSocket from "reconnecting-websocket";

import {contestActions} from "./store/data/contests";
import {userActions} from "./store/data/users";
import {submissionActions} from "./store/data/submissions";
import {problemActions} from "./store/data/problems";
import {getJwt, logout} from "./common/authService";
import SubmissionRoute from "./apps/submission/submissionRoute";
import WebSocketReceive from "./store/webSocketReceive";
import httpService from "./common/httpService";
import {tutorialActions} from "./store/data/tutorials";
import TutorialRoute from "./apps/tutorial/tutorialRoute";

export const SuperContext = React.createContext();

const App = () => {
    const data = generateData();

    useEffect(() => {
        data.userActs.loadUsers();
        if(getJwt()) {
            httpService.get(apiEndpoint + '/login_check/').then(({data}) => {
                if (!data.status) {
                    logout();
                }
            })
        }
    }, [])

    return (
        <SuperContext.Provider value={data}>
            <div>
                <LoadingAnimation />
                <NavBar/>
                <WebSocketReceive />
                <Switch>
                    <Route path={projectURLS.contests} component={ContestRoute}/>
                    <Route path={projectURLS.problems} component={ProblemRoute}/>
                    <Route path={projectURLS.submissions} component={SubmissionRoute} />
                    <Route path={projectURLS.tutorials} component={TutorialRoute} />
                    <Route path={projectURLS.user} component={UserRoute}/>
                </Switch>
            </div>
        </SuperContext.Provider>
    );
};

export default App;


const generateData = () => {
    const store = storeFunc();
    const jwt = getJwt();
    const ws = new ReconnectingWebSocket(`${wssURL()}/?jwt=${jwt || 'hello'}`, '', {
        maxReconnectionDelay: 60000,
        minReconnectionDelay: 500,
    });

    const contestActs = new contestActions(store, ws);
    const userActs = new userActions(store, ws);
    const submissionActs = new submissionActions(store, ws);
    const problemActs = new problemActions(store, ws);
    const tutorialActs = new tutorialActions(store, ws);
    return {
        contestActs: contestActs,
        userActs: userActs,
        submissionActs: submissionActs,
        problemActs: problemActs,
        tutorialActs: tutorialActs,
        store: store, ws: ws
    }
}
