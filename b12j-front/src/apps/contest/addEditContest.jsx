import React, { useContext} from "react";
import { SuperContext } from "../../context";
import ContestForm from "../../components/forms/contestForm";
import { getCurrentUser } from "../../components/authService";
import { urls } from "../../configuration";

const AddEditContest = ({ history, match }) => {
  const { id } = match.params;
  const { contestActs, userActs } = useContext(SuperContext);
  const users = userActs.getList();
  const contest = contestActs.getById(id);

  if (!getCurrentUser()) {
    history.push(urls.login);
  }
  return (
    <div>
      {!contest && <div>
        <h1>Add new contest</h1>
        <ContestForm users={users} history={history} />
      </div>}
      {contest &&
      <div>
        <h1>{contest.title}</h1>
        <ContestForm users={users} history={history} contest={contest} />
      </div>}
    </div>
  );
};

export default AddEditContest;