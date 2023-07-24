import React, { useEffect, useState } from "react";
import { getCurrentUser } from "../../components/authService";
import { apiEndpoint, urls } from "../../configuration";
import { startLoading } from "../../components/loadingAnimation";
import http from "../../components/httpService";
import { renderProblemList } from "../problem/problemList";

const TestProblems = ({ history }) => {
  const [testProblem, setTestProblem] = useState([]);

  const user = getCurrentUser();
  if (!user) history.push(urls.login);

  useEffect(() => {
    const apiCall = async () => {
      startLoading("Loading Testable problems");
      const testProblemData = await http.get(`${apiEndpoint}/problems/?test_problems=true&limit=10`);
      setTestProblem(testProblemData.data.results);
    };
    apiCall();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      {renderProblemList(testProblem, urls.problems)}
    </div>
  );
};

export default TestProblems;