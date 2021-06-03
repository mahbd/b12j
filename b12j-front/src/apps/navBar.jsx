import React, {useContext} from 'react';
import {NavLink} from "react-router-dom";
import {css} from "../main_css";
import {SuperContext} from "../context";
// import Headroom from "react-headroom";

const NavBar = () => {
  const {userActs} = useContext(SuperContext);
  const user = userActs.currentUser();
  return (
    <nav className={css.navbar} id={"navBar1"}>
      <div className={"container-fluid"}>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse"
                data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false"
                aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"/>
        </button>
        {/*<Headroom>*/}
        <div className="collapse navbar-collapse" id="navbarSupportedContent">

          <ul className="navbar-nav">
            <li className="nav-item">
              <NavLink className="nav-link" to="/home">Home</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/contests">Contests</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/problems">Problems</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/submissions">Submission</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/tutorials">Tutorials</NavLink>
            </li>
            <li className="nav-item">
              {!user && <NavLink to="/users/login" className="nav-link">Login</NavLink>}
              {user && <NavLink to="/users/profile" className="nav-link">Profile</NavLink>}
            </li>
          </ul>
        </div>
        {/*</Headroom>*/}
      </div>
    </nav>
  );
}

export default NavBar;
