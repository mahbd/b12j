import React, {useContext, useState} from 'react';
import {SuperContext} from "../../app";
import ProblemList from "../problem/problemList";
import Countdown from "react-countdown";
import TutorialList from "../tutorial/tutorialList";
import {Link} from "react-router-dom";

const Contest = ({match}) => {
    const {contestId} = match.params;
    const {contestActs} = useContext(SuperContext);
    const [contest, setContest] = useState(contestActs.getById(contestId));
    const [reload, setReload] = useState(false);

    const forceReload = () => {
        setReload(!reload);
    }

    let unSubscribe = contestActs.store.subscribe(() => {
        setContest(contestActs.getById(contestId));
        setReload(!reload);
        unSubscribe();
    })

    const contestStart = new Date((contest && contest.start_time) || Date.now().toLocaleString());
    const contestEnd = new Date((contest && contest.end_time) || Date.now().toLocaleString());

    return (
        <div className="container">
            {contestStart > Date.now() && <div className="container">
                <p className="display-4">{contest.title}</p>
                <Countdown date={contest.start_time} className="display-4" onComplete={forceReload}/>
            </div>}

            {contest && <div>
                <h1 className="text-success">{contest.title}</h1>
                <Link to={`/contests/standing/${contestId}`}><button className="btn-lg btn-outline-success">Standing</button></Link>
            </div>}

            {contestEnd <= Date.now() && <div>
                <h2>Tutorials</h2>
                <TutorialList match={match}/>
            </div>}

            {contestStart <= Date.now() && <div>
                <h2>Problems</h2>
                <ProblemList match={match}/>
            </div>}
        </div>
    );
};

export default Contest;