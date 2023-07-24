import React, { useContext} from "react";
import { SuperContext } from "../../context";
import ProblemForm from "../../components/forms/problemForm";
import { getCurrentUser } from "../../components/authService";
import { urls } from "../../configuration";

const AddEditProblem = ({ match, history }) => {
  const { id } = match.params;
  const { problemActs } = useContext(SuperContext);
  const problem = problemActs.getById(id);

  if (!getCurrentUser()) {
    history.push(urls.login);
  }

  return (
    <div>
      {!id && !problem && <div>
        <h1>Add new problem</h1>
        <ProblemForm history={history} />
      </div>}
      {problem &&
      <div>
        <h1>{problem.title}</h1>
        <ProblemForm history={history} problem={problem} />
      </div>}
    </div>
  );
};

export default AddEditProblem;