import React, { useEffect, useState } from "react";
import { getCurrentUser } from "../../components/authService";
import { apiEndpoint, urls } from "../../configuration";
import http from "../../components/httpService";
import { startLoading } from "../../components/loadingAnimation";
import { renderProblemList } from "../problem/problemList";

const UnsolvedProblems = ({ history }) => {
  const [unsolvedProblem, setUnsolvedProblem] = useState([]);

  const user = getCurrentUser();
  if (!user) history.push(urls.login);

  useEffect(() => {
    const apiCall = async () => {
      startLoading("Loading Unsolved problems");
      const unsolvedProblemData = await http.get(`${apiEndpoint}/problems/?unsolved_problems=true`);
      setUnsolvedProblem(unsolvedProblemData.data.results);
    };
    apiCall();
  }, []);
  return (
    <div>
      {renderProblemList(unsolvedProblem, urls.problems)}
    </div>
  );
};

export default UnsolvedProblems;