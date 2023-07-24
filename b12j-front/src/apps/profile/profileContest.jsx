import React, { useEffect, useState } from "react";
import { getCurrentUser } from "../../components/authService";
import { apiEndpoint, urls } from "../../configuration";
import { startLoading } from "../../components/loadingAnimation";
import http from "../../components/httpService";
import { Table } from "../../components/customTags";
import { Link } from "react-router-dom";
import { extractDate } from "../others/functions";

const ProfileContest = ({ history }) => {
  const [userContest, setUserContest] = useState([]);

  const user = getCurrentUser();
  if (!user) history.push(urls.login);
  useEffect(() => {
    const apiCall = async () => {
      startLoading("Loading Contests set by user");
      const userContestData = await http.get(`${apiEndpoint}/contests/?user_contests=true&limit=10`);
      setUserContest(userContestData.data.results);
    };
    apiCall();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const contestData = [];
  for (let contest of userContest) {
    contestData.push([
      <Link to={`${urls.contests}/${contest.id}`}>{contest.title}</Link>,
      extractDate(contest.date),
      <a href={`${urls.editContest}/${contest.id}`} className="btn-sm btn-warning me-2">
        Edit
      </a>
    ]);
  }

  return (
    <div>
      <Table headers={["Title", "Date", "Buttons"]} body={contestData} />
    </div>
  );
};

export default ProfileContest;