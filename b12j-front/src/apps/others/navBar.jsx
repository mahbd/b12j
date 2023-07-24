import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import { css } from "../../main_css";
import { SuperContext } from "../../context";
import { urls } from "../../configuration";
import { logout } from "../../components/authService";

const NavBar = () => {
  const { userActs } = useContext(SuperContext);
  const user = userActs.currentUser();
  return (
    <nav className={css.navbar} id={"navBar1"}>
      <div className={"container-fluid"}>
        <button
          className="navbar-toggler btn-outline-dark"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"  />
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav d-inline-flex">
            <li className="nav-item">
              <NavLink className="nav-link" to={urls.home}>
                Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to={urls.contests}>
                Contests
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to={urls.problems}>
                Problems
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to={urls.submissions}>
                Submissions
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to={urls.tutorials}>
                Tutorials
              </NavLink>
            </li>

            {!user &&
            <li className="nav-item">
              <NavLink to={urls.register} className="nav-link">
                Register
              </NavLink>
            </li>}
            {!user &&
            <li className="nav-item">
              <NavLink to={urls.login} className="nav-link">
                Login
              </NavLink>
            </li>}
            {user && <li className="nav-item">
              <NavLink to={urls.profile} className="nav-link">
                Profile
              </NavLink>
            </li>
            }

            {user && (
              <li className={"nav-item"}>
                <button onClick={() => logout()} className={"btn btn-sm fw-bold btn-outline-danger nav-link border-0"}>
                  Logout
                </button>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
