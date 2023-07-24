import React, { useEffect, useState } from "react";
import { getCurrentUser } from "../../components/authService";
import { apiEndpoint, urls } from "../../configuration";
import { startLoading } from "../../components/loadingAnimation";
import http from "../../components/httpService";
import { renderProblemList } from "../problem/problemList";

const UserProblems = ({ history }) => {
  const [userProbList, setUserProbList] = useState([]);

  const user = getCurrentUser();
  if (!user) history.push(urls.login);

  useEffect(() => {
    const apiCall = async () => {
      startLoading("Loading Problem set by user");
      const userProblemData = await http.get(`${apiEndpoint}/problems/?user_problems=true&limit=10`);
      setUserProbList(userProblemData.data.results);
    };
    apiCall();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div>
      {renderProblemList(userProbList, urls.problems)}
    </div>
  );
};

export default UserProblems;