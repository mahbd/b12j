import React from 'react';
import {Route, Switch} from 'react-router-dom';
import Login from "./login";
import {urls} from "../../configuration";
import UserList from "./userList";
import Profile from "./profile";

const UserRoute = () => {
    return (
        <Switch>
            <Route path={urls.login} component={Login} />
            {/*<Route path="/users/profile" component={Profile} />*/}
            {/*<Route path="/users/list" component={UserList}/>*/}
        </Switch>
    );
};

export default UserRoute;