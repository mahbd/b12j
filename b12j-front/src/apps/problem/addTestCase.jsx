import React, { useContext } from "react";
import { SuperContext } from "../../context";
import { getCurrentUser } from "../../components/authService";
import { urls } from "../../configuration";
import TestCaseForm from "../../components/forms/testCaseForm";

const AddTestCase = ({ match, history }) => {
  const { problemId } = match.params;
  const { problemActs } = useContext(SuperContext);
  const problem = problemActs.getById(problemId);

  if (!getCurrentUser()) {
    history.push(urls.login);
  }

  return (
    problem && <div>
      <TestCaseForm history={history} problem={problem} />
    </div>
  );
};

export default AddTestCase;