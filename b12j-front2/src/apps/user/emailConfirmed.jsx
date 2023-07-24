import React, { useEffect } from "react";
import { startLoading, stopLoading } from "../../components/loadingAnimation";
import httpService from "../../components/httpService";
import { apiEndpoint, serverUrls, urls } from "../../configuration";

const EmailConfirmed = ({ match, history }) => {
  const { uid, token } = match.params;
  useEffect(() => {
    if (uid && token) {
      startLoading("Validating Confirmation URL");
      httpService.post(`${apiEndpoint}${serverUrls.confirmEmail}/`, { uid, token })
        .then(res => {
          console.log(res.status);
          startLoading("Email Confirmed. Redirecting to Login page");
          setTimeout(() => {
            stopLoading();
            history.replace(urls.login);
          }, 1000);
        }).catch(ex => {
        if (ex.response && ex.response.status === 403) {
          startLoading("Email Confirmed. Redirecting to Login page");
          setTimeout(() => {
            stopLoading();
            history.replace(urls.login);
          }, 1000);
        } else {
          startLoading("Wrong URL. Please try new URL");
          setTimeout(() => {
            stopLoading();
            history.replace(urls.resendActivationEmail);
          }, 800);
        }
      });
    }
  });

  return (
    <div>

    </div>
  );
};

export default EmailConfirmed;