import React from "react";
import { getCurrentUser } from "../../components/authService";
import { urls } from "../../configuration";

const EmailSent = ({ history }) => {
  if (getCurrentUser()) {
    history.replace(urls.profile);
  }
  return (
    <div className={"container"}>
      <div className="alert alert-success">
        <strong>An Email is sent to you. Please don't forget to check spam folder.</strong>
      </div>
    </div>
  );
};

export default EmailSent;