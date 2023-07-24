import React from "react";
import { Route, Switch } from "react-router-dom";
import Login from "./login";
import { urls } from "../../configuration";
import UserList from "./userList";
import Register from "./register";
import RegistrationSuccessful from "./registrationSuccessful";
import ResendActivation from "./resendActivation";
import ResetPassword from "./resetPassword";
import EmailConfirmed from "./emailConfirmed";
import ResetPasswordGivePass from "./resetPasswordGivePass";

const UserRoute = () => {
   return (
      <Switch>
         <Route path={urls.login} component={Login} />
         <Route path={urls.register} component={Register} />
         <Route path={urls.registerSuccess} component={RegistrationSuccessful} />
         <Route path={`${urls.confirmEmail}/:uid/:token`} component={EmailConfirmed} />
         <Route path={urls.resendActivationEmail} component={ResendActivation} />
         <Route path={urls.resetPassword} component={ResetPassword} />
         <Route path={`${ urls.resetPasswordConfirm }/:uid/:token`} component={ResetPasswordGivePass} />
         <Route path={urls.userList} component={UserList} />
      </Switch>
   );
};

export default UserRoute;
