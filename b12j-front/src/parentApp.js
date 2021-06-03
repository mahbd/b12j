import React, {useEffect} from 'react';
import {getJwt, logout} from "./common/authService";
import httpService from "./common/httpService";
import {endpoint, wssURL} from "./configuration";
import storeFunc from "./store/configureStore";
import ReconnectingWebSocket from "reconnecting-websocket";
import {contestActions} from "./store/data/contests";
import {userActions} from "./store/data/users";
import {submissionActions} from "./store/data/submissions";
import {problemActions} from "./store/data/problems";
import {tutorialActions} from "./store/data/tutorials";
import WebSocketReceive from "./store/webSocketReceive";
import App from "./app";

import {SuperContext} from "./context";
import {problemDiscussionActions} from "./store/data/problemDiscussion";
import {tutorialDiscussionActions} from "./store/data/tutorialDiscussion";

const ParentApp = () => {
  const data = generateData();
  useEffect(() => {
    if (getJwt()) {
      httpService.get(endpoint + '/users/login_check/').then(({data}) => {
        if (!data.status) {
          console.log("Wrong credentials");
          logout();
        }
      })
    }
  }, [])
  return (
    <SuperContext.Provider value={data}>
      <div>
        <WebSocketReceive/>
        <App />
      </div>
    </SuperContext.Provider>
  );
};

export default ParentApp;

const generateData = () => {
  const store = storeFunc();
  const ws = new ReconnectingWebSocket(`${wssURL()}/`, '', {
    maxReconnectionDelay: 60000,
    minReconnectionDelay: 500,
  });

  const contestActs = new contestActions(store, ws);
  const problemActs = new problemActions(store, ws);
  const problemDiscussionActs = new problemDiscussionActions(store, ws);
  const submissionActs = new submissionActions(store, ws);
  const tutorialActs = new tutorialActions(store, ws);
  const tutorialDiscussionActs = new tutorialDiscussionActions(store, ws);
  const userActs = new userActions(store, ws);
  return {
    contestActs,
    problemActs,
    problemDiscussionActs,
    store,
    submissionActs,
    tutorialActs,
    tutorialDiscussionActs,
    userActs,
    ws,
  }
}