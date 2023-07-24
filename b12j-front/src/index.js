import ReactDOM from "react-dom";
import { BrowserRouter} from "react-router-dom";
import { getJwt, verifyUpdateAccessToken } from "./components/authService";
import { wssURL } from "./configuration";
import { SuperContext } from "./context";
import WebSocketReceive from "./store/webSocketReceive";
import storeFunc from "./store/configureStore";
import ReconnectingWebSocket from "reconnecting-websocket";
import { contestActions } from "./store/data/contests";
import { problemActions } from "./store/data/problems";
import { problemDiscussionActions } from "./store/data/problemDiscussion";
import { submissionActions } from "./store/data/submissions";
import { tutorialActions } from "./store/data/tutorials";
import { tutorialDiscussionActions } from "./store/data/tutorialDiscussion";
import { userActions } from "./store/data/users";
import React, { useEffect } from "react";

import "./index.css";
import "./quill.css"
import LoadingAnimation from "./components/loadingAnimation";
import App from "./app";

const generateData = () => {
  const store = storeFunc();
  const ws = new ReconnectingWebSocket(`${wssURL()}/`, "", {
    maxReconnectionDelay: 60000,
    minReconnectionDelay: 500
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
    ws
  };
};

const ParentApp = () => {
  const data = generateData();
  useEffect(() => {
    if (getJwt()) {
      verifyUpdateAccessToken();
    }
  }, []);

  return (
    <SuperContext.Provider value={data}>
      <div>
        <LoadingAnimation />
        <WebSocketReceive />
        <App />
      </div>
    </SuperContext.Provider>
  );
};

ReactDOM.render(
  <BrowserRouter>
    <ParentApp />
  </BrowserRouter>,
  document.getElementById("root")
);
