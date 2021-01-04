import React, {useContext} from 'react';
import {NavLink} from "react-router-dom";
import {SuperContext} from "../app";

const NavBar = () => {
    const {userActs} = useContext(SuperContext);
    const user = userActs.currentUser();
    return (
        <nav className="navbar navbar-expand navbar-dark bg-dark">
            {/*<button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav"*/}
            {/*        aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">*/}
            {/*    <span className="navbar-toggler-icon"/>*/}
            {/*</button>*/}
            <div className="" id="navbarNav">
                <ul className="navbar-nav">
                    <li className="nav-item">
                        <NavLink className="nav-link" to="/">Home <span className="sr-only">(current)</span></NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink className="nav-link" to="/contests">Contests</NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink className="nav-link" to="/submissions">Submission</NavLink>
                    </li>
                    <li className="nav-item">
                        {!user && <NavLink to="/users/login" className="nav-link">Login</NavLink>}
                        {user && <NavLink to="/users/profile" className="nav-link">Profile</NavLink>}
                    </li>
                </ul>
            </div>
        </nav>
    );
}

export default NavBar;
