import React from 'react';
import {Route, Switch} from 'react-router-dom';
import Login from "./login";
import {projectURLS} from "../../configuration";
import UserList from "./userList";
import Profile from "./profile";
import LoginServe from "./loginServe";

const UserRoute = () => {
    return (
        <Switch>
            <Route path={projectURLS.login} component={Login} />
            <Route path="/users/profile" component={Profile} />
            <Route path="/users/list" component={UserList}/>
            <Route path="/users/loginServe" component={LoginServe}/>
        </Switch>
    );
};

export default UserRoute;