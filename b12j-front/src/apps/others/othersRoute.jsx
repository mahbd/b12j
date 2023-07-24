import React from "react";
import { Route, Switch } from "react-router-dom";
import { urls } from "../../configuration";
import EmailSent from "./emailSent";
import PrivacyPolicy from "./privacyPolicy";


const OthersRoute = () => {
   return (
      <Switch>
         <Route path={urls.emailSent} component={EmailSent} />
         <Route path={urls.privacyPolicy} component={PrivacyPolicy} />
      </Switch>
   );
};

export default OthersRoute;
