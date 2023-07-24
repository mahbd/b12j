import React from "react";
import { getCurrentUser } from "../../components/authService";
import { urls } from "../../configuration";
import { Slide } from "react-awesome-reveal";
import { Link } from "react-router-dom";
import ChangeUsernameForm from "../../components/forms/changeUsernameForm";
import ChangePasswordForm from "../../components/forms/changePasswordForm";

const Profile = ({ history }) => {
  const user = getCurrentUser();

  if (!user) {
    history.push(urls.login);
  }

  const toggleHide = elementId => {
    const element = document.getElementById(elementId);
    if (element.style.display === "none") {
      element.style.display = "block";
    } else {
      element.style.display = "none";
    }
  };
  return (
    <div>
      <Slide>
        <p className={"text-center display-3 fw-bold"}>Hey, {user.name}</p>
      </Slide>
      <div className="row" id={"add-new"}>
        <div className="col-auto p-2">
          <Link to={urls.addProblem} className="btn btn-outline-dark">
            New problem
          </Link>
        </div>
        <div className="col-auto p-2">
          <a href={urls.addTutorial} className="btn btn-outline-dark">
            New tutorial
          </a>
        </div>
        <div className="col-auto p-2">
          <a href={urls.addContest} className="btn btn-outline-dark">
            Start Contest
          </a>
        </div>
      </div>

      <div className="row">
        <div className="col-sm-6">
          <div className={"row"}>
            <h2 className={"text-info display-4"}>Your Statistics</h2>
            <p className={"fw-bold h4 col-auto"}>Problems Solved: 10</p>
            <p className={"fw-bold h4 col-auto"}>Problems Wrote: 10</p>
            <p className={"fw-bold h4 col-auto"}>Tutorial Wrote: 10</p>
            <p className={"fw-bold h4 col-auto"}>Contest Writer: 10</p>
            <p className={"fw-bold h4 col-auto"}>Contest Tester: 10</p>
          </div>
          <div className={""}>
            <h2 className={"text-info display-4"}>Your Info</h2>
            <p className={"fw-bold h4"}>Username: {user.username}</p>
            <p className={"fw-bold h4"}>First Name: {user.first_name}</p>
            <p className={"fw-bold h4"}>Last Name: {user.last_name}</p>
            <p className={"fw-bold h4"}>Email: {user.email}</p>
          </div>
        </div>
        <div className="col-sm-6 bg-light">
          <div style={{"width": "300px"}}>
            <svg xmlns="http://www.w3.org/2000/svg" width="300px" height="300px" fill="currentColor"
                 className="bi bi-person-circle" viewBox="0 0 16 16">
              <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
              <path fill-rule="evenodd"
                    d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z" />
            </svg>
          </div>
        </div>
      </div>

      <div className="row" id={"add-new"}>
        <div className="col-auto p-2">
          <button type={"button"} className="btn btn-outline-dark" onClick={() => toggleHide("changeUsername")}>
            Change Username
          </button>
        </div>
        <div className="col-auto p-2">
          <button disabled={true} type={"button"} className="btn btn-outline-dark">
            Change Password
          </button>
        </div>
        <div className="col-auto p-2">
          <button disabled={true} type={"button"} className="btn btn-outline-dark">
            Change Password
          </button>
        </div>
      </div>
      <div id={"changeUsername"} style={{ "display": "none" }}>
        <ChangeUsernameForm />
      </div>
      <div id={"changePassword"} style={{ "display": "none" }}>
        <ChangePasswordForm />
      </div>
    </div>
  );
};

export default Profile;