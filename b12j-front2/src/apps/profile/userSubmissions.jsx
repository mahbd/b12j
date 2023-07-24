import React, { useContext, useEffect, useState } from "react";
import { startLoading } from "../../components/loadingAnimation";
import http from "../../components/httpService";
import { apiEndpoint, urls } from "../../configuration";
import { renderSubmissionList } from "../submission/submissionList";
import { SuperContext } from "../../context";
import { getCurrentUser } from "../../components/authService";

const UserSubmissions = ({ history }) => {
  const { userActs } = useContext(SuperContext);
  const [userSubmissionList, setUserSubmissionList] = useState([]);

  const user = getCurrentUser();
  if (!user) history.push(urls.login);

  useEffect(() => {
    const apiCall = async () => {
      startLoading("Loading Users submissions");
      const userSubmissionData = await http.get(`${apiEndpoint}/submissions/?user_id=${user.user_id}&limit=10`);
      setUserSubmissionList(userSubmissionData.data.results);
    };
    apiCall();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div>
      {renderSubmissionList(userSubmissionList, userActs)}
    </div>
  );
};

export default UserSubmissions;