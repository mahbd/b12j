import React, { useContext } from "react";
import { SuperContext } from "../../context";

import dayjs from "dayjs";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import ContestCard from "../../components/cards/contestCard";
import { pagination } from "../../components/helperFunctions";
import { urls } from "../../configuration";

dayjs.extend(isSameOrBefore);

const ContestList = ({match}) => {
  const {page} = parseInt(match.params.page) || 1;
  const { contestActs, userActs } = useContext(SuperContext);
  let contestList = contestActs.getListPage(page);
   const pages = contestActs.totalPages();
  let ended = [],
    upcoming = [];
  for (let contest of contestList) {
    if (dayjs(contest.end_time).isSameOrBefore(Date.now())) {
      ended.push(contest);
    } else upcoming.push(contest);
  }

  return (
    <div className="container m-2">
      <div className={"h2"}>Current or Upcoming contests</div>
      {upcoming.map((contest) => (
        <ContestCard key={contest.id} contest={contest} userActs={userActs} />
      ))}
      <p className={"mt-5"} />
      <div className={"h2"}>Past contests</div>
      {ended.map((contest) => (
        <ContestCard key={contest.id} contest={contest} userActs={userActs} prev={true} />
      ))}
      {pagination(`${urls.contests}/page=`, pages, page)}
    </div>
  );
};

export default ContestList;
