import React, {useContext} from 'react';
import {SuperContext} from "../context";

const WebSocketReceive = () => {
    const {ws, contestActs, problemActs, submissionActs, userActs, tutorialActs} = useContext(SuperContext);
    ws.addEventListener('message', (e) => {
        console.log(e);
        const data = JSON.parse(e.data).data;
        if(data.target === 'contest') contest(contestActs, data);
        if(data.target === 'problem') problem(problemActs, data);
        if(data.target === 'submission') submission(submissionActs, data);
        if(data.target === 'user') user(userActs, data);
        if(data.target === 'tutorial') tutorial(tutorialActs, data);
    });

    return <span />
};

const contest = (contestActs, data) => {
    contestActs.update(data);
}

const problem = (problemActs, data) => {
    problemActs.update(data);
}

const submission = (submissionActs, data) => {
    submissionActs.update(data);
}

const user = (userActs, data) => {
    userActs.update(data);
}

const tutorial = (tutorialActs, data) => {
    tutorialActs.update(data);
}

export default WebSocketReceive;