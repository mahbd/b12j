import React from "react";
import { getCurrentUser } from "../../components/authService";
import { urls } from "../../configuration";

const RegistrationSuccessful = ({history}) => {
  if (getCurrentUser()) {
    history.replace(urls.profile);
  }
  return (
    <div className={"container"}>
      <div className="alert alert-success">
        <strong>Registration Successful!</strong>
      </div>
      <div className="alert alert-info">
        <p>An activation email is sent to your email address. Please confirm your email address by
          visiting the sent link. Don't forget to check your spam folder.</p>
      </div>
      <div className="alert alert-warning">
        <p>You won't be able to login before confirming email address.</p>
      </div>
    </div>
  );
};

export default RegistrationSuccessful;