import React from "react";
import RegisterForm from "../../components/forms/registerForm";
import { getCurrentUser } from "../../components/authService";
import { urls } from "../../configuration";

const Register = ({ history }) => {
  if (getCurrentUser()) {
    history.replace(urls.profile);
  }
  return (
    <div className={"one-form"}>
      <RegisterForm history={history} />
    </div>
  );
};

export default Register;