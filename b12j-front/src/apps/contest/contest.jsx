import React, {useContext, useState} from 'react';
import {SuperContext} from "../../app";
import ProblemList from "../problem/problemList";
import Countdown from "react-countdown";
import TutorialList from "../tutorial/tutorialList";
import {Link} from "react-router-dom";
import {FormattedHtml} from "../../common/objectViewFuncs";

const Contest = ({match}) => {
    const {contestId} = match.params;
    const {contestActs, userActs} = useContext(SuperContext);
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
            {contest && <div>
                <p className="text-success display-4">{contest.title}</p>
                <table className="table table-bordered table-striped">
                    <thead>
                    <th>Contest Writers</th>
                    <th>Contest Testers</th>
                    </thead>
                    <tbody>
                    <td>{contest.hosts.map((userId) => <p className="user" key={userId}>{userActs.firstName(userId)}</p>)}</td>
                    <td>{contest.testers.map((userId) => <p className="user" key={userId}>{userActs.firstName(userId)}</p>)}</td>
                    </tbody>
                </table>
                {contest.text && <div>
                    <h2>About contest</h2>
                    <div className="bgAliceBlue">
                        <FormattedHtml text={contest.text}/>
                    </div>
                    <br/>
                </div>}
                <Link to={`/contests/standing/${contestId}`}>
                    <button className="btn-lg btn-outline-success">Standing</button>
                </Link>
            </div>}
            {contestStart > Date.now() && <div className="container">
                <Countdown date={contest.start_time} className="display-4" onComplete={forceReload}/>
            </div>}

            {contestStart <= Date.now() && <div>
                <h2>Problems</h2>
                <ProblemList match={match}/>
            </div>}


            {contestEnd <= Date.now() && <div>
                <h2>Tutorials</h2>
                <TutorialList match={match}/>
            </div>}
        </div>
    );
};

export default Contest;