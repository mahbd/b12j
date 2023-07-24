import React from "react";
import LoginForm from "../../components/forms/loginForm";
import { getCurrentUser } from "../../components/authService";
import { urls } from "../../configuration";

const Login = ({history}) => {
  if (getCurrentUser()) {
    history.replace(urls.profile);
  }
  return (
    <div className={"one-form"}>
      <LoginForm history={history} />
    </div>
  );
};

export default Login;
