import React, { useContext, useEffect, useState } from "react";
import { getCurrentUser } from "../../components/authService";
import { apiEndpoint, urls } from "../../configuration";
import { startLoading } from "../../components/loadingAnimation";
import http from "../../components/httpService";
import { renderTutorialList } from "../tutorial/tutorialList";
import { SuperContext } from "../../context";

const ProfileTutorials = ({history}) => {
  const { userActs } = useContext(SuperContext);
  const [userTutorialList, setUserTutorialList] = useState([]);
  const user = getCurrentUser();
  if (!user) history.push(urls.login);

  useEffect(() => {
    const apiCall = async () => {
      startLoading("Loading Tutorial set by user");
      const userTutorialData = await http.get(`${apiEndpoint}/tutorials/?user_tutorials=true&limit=10`);
      setUserTutorialList(userTutorialData.data.results);
    };
    apiCall();
  }, []);
  return (
    <div>
      {renderTutorialList(userTutorialList, userActs)}
    </div>
  );
};

export default ProfileTutorials;