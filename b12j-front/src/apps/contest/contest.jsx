import React, {useContext} from 'react';
import ProblemList from "../problem/problemList";
import Countdown from "react-countdown";
import TutorialList from "../tutorial/tutorialList";
import {Link} from "react-router-dom";
import {FormattedHtml} from "../../common/objectViewFuncs";
import {SuperContext} from "../../context";

const Contest = ({match}) => {
  const {contestId} = match.params;
  const {contestActs, userActs} = useContext(SuperContext);
  const contest = contestActs.getById(contestId);

  const contestStart = new Date((contest && contest.start_time) || Date.now().toLocaleString());
  const contestEnd = new Date((contest && contest.end_time) || Date.now().toLocaleString());

  return (
    <div className="container">
      {contest && <div>
        <div className={"pt-2"}>
          <div className={"row"}>
            <div className="col"/>
            <div className="display-4 bg-secondary text-white col-auto rounded-3">{contest.title}</div>
            <div className="col"/>
          </div>
          <br/>
          <div className="row">
            <div className="col-auto p-2">
              <button className="btn btn-dark">Problems</button>
            </div>
            <div className="col-auto p-2">
              <button className="btn btn-dark">Announcements</button>
            </div>
            <div className="col-auto p-2">
              <Link to={`/contests/standing/${contestId}`}>
                <button className="btn btn-dark">Standing</button>
              </Link>
            </div>
            <div className="col-auto p-2">
              <button className="btn btn-dark">Tutorials</button>
            </div>
            <div className="col-auto p-2">
              <button className="btn btn-dark">Submissions</button>
            </div>
            <div className="col-auto p-2">
              <button className="btn btn-dark">Your Submissions</button>
            </div>
          </div>
        </div>

        {contestStart > Date.now() && <div className={"pt-5 pb-5 text-center"}>
          <p className={"h1"}>Starts in: </p>
          <Countdown date={contest.start_time} className="h1"/>
        </div>}

        <div>
          <div className="row">
            <h2>About contest</h2>
            <div className="col"/>
          </div>
          <div>
            {contest.text && <FormattedHtml text={contest.text}/>}
          </div>
          {contest.writers.map((userId) => <p className="user" key={userId}>{userActs.firstName(userId)}</p>)}
          {contest.testers.map((userId) => <p className="user" key={userId}>{userActs.firstName(userId)}</p>)}
          <br/>
        </div>
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