import React, {useContext} from 'react';
import {Link} from "react-router-dom";
import {extractDate} from "../functions";
import {SuperContext} from "../../context";
import {css} from "../../main_css";
import {urls} from "../../configuration";
import Countdown from "react-countdown";

const ContestList = () => {
  const {contestActs, userActs} = useContext(SuperContext);
  const contestList = contestActs.getList();
  let ended = [], upcoming = [];
  for (let i = 0; i < contestList.length; i++) {
    let contest = contestList[i];
    let end_time = new Date(contest.end_time).getTime();
    if (end_time < Date.now()) {
      ended.push(contestList[i]);
    } else upcoming.push(contestList[i]);
  }
  console.log("Running Contest list")
  return (
    <div className="container p-2">
      <div className={css.heading4}>Current or Upcoming contests</div>
      {upcoming.map((contest) =>
        <div key={contest.id}>
          <p className={"mt-4"}/>
          <div className={"card rounded-top"}>
            <div className={"card-header h4"}>
              <Link to={`${urls.contests}/${contest.id}`} className={"white-link"}>{contest.title} </Link>
            </div>
            <div className={"card-body"}>
              <div className="row">
                <div className="col">
                  <b>Writer(s)</b><br/>
                  {contest.writers.map(
                    userId => <p className="user" key={userId}>{userActs.fullName(userId)}</p>)}
                </div>
                <div className="col">
                  <b>Tester(s)</b><br/>
                  {contest.testers.map(
                    userId => <p className="user" key={userId}>{userActs.fullName(userId)}</p>)}
                </div>
              </div>
              <div className={"row"}>
                <div className="col">
                  <p><b>Start at: </b>{extractDate(contest.start_time)}</p>
                </div>
                <div className="col">
                  <b>Length: </b>{getTimeDifference(new Date(contest.end_time), new Date(contest.start_time))}
                </div>
              </div>
              <div className={"text-center"}>
                {new Date(contest.start_time) > Date.now() && <div>
                  <Countdown date={contest.start_time} className={"h2"}/>
                </div>}
              </div>
            </div>
          </div>
        </div>
      )}
      <p className={"mt-5"}/>
      <div className={css.heading4}>Past contests</div>
      {ended.map((contest) =>
        <div key={contest.id}>
          <p className={"mt-4"}/>
          <div className={"card pb-4"}>
            <div className={"card-header h4"}>
              {contest.title}
            </div>
            <div className={"card-body"}>
              <div className="row">
                <div className="col">
                  <b>Writer(s)</b><br/>
                  {contest.writers.map(
                    userId => <p className="user" key={userId}>{userActs.fullName(userId)}</p>)}
                </div>
                <div className="col">
                  <b>Tester(s)</b><br/>
                  {contest.testers.map(
                    userId => <p className="user" key={userId}>{userActs.fullName(userId)}</p>)}
                </div>
              </div>
              <div className={"row"}>
                <div className="col">
                  <p><b>Ended at: </b>{extractDate(contest.end_time)}</p>
                </div>
                <div className="col">
                  <b>Length: </b>{getTimeDifference(new Date(contest.end_time), new Date(contest.start_time))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ContestList;

const getTimeDifference = (start, end) => {
  let dif;
  if (end.getTime() > start.getTime()) {
    dif = (end.getTime() - start.getTime()) / 1000;
  } else dif = (start.getTime() - end.getTime()) / 1000;
  const hour = Math.floor(dif / 3600);
  const minute = Math.floor((dif - hour * 3600) / 60);
  if (minute > 2) return `${hour} hour(s) ${minute} minute(s)`;
  return `${hour} hour(s)`;
}
