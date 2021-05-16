import React, {useContext, useEffect, useState} from 'react';
import {FormattedHtml} from "../../common/objectViewFuncs";
import ProblemCode from "../../common/fields/problemCode";
import {Link} from "react-router-dom";
import {getCurrentUser} from "../../common/authService";
import {SuperContext} from "../../context";

const Problem = ({match}) => {
  const {problemActs, userActs} = useContext(SuperContext);
  const {problemId} = match.params;
  const problem = problemActs.getById(problemId);

  const currentUser = getCurrentUser() && getCurrentUser().id;
  const is_admin = currentUser && getCurrentUser().is_superuser;

  return (
    problem && <div className="container">
      {/*{(currentUser === problem.by || is_admin) &&*/}
      {/*<Link to={`/problems/edit/${problem.id}`}>*/}
      {/*    <button className="btn-lg btn-success">Edit</button>*/}
      {/*</Link>}*/}
      <div className="row pt-2 pb-5">
        <div className="col"><Link to={"/problems"} className={"white-link"}>Back</Link></div>
        <h1 className={"col-auto h1 text-secondary rounded-3"}>{problem.title}</h1>
        <div className="col"><p className={"text-end"}>Submit</p></div>
        <p className={"text-center"}>Writer: {userActs.fullName(problem.by)} <br/>
          Time Limit: {problem.memory_limit} MB <br/>
          Memory Limit: {problem.time_limit} second(s) <br/>
        </p>
      </div>
      <div>
        {problem.notice && <div className="alert alert-info">{problem.notice}</div>}
        <b className={"h5"}>Problem statement</b>
        <FormattedHtml text={problem.text}/> <br/>
        <b className={"h5"}>Input Terms</b>
        <FormattedHtml text={problem.inTerms}/> <br/>
        <b className={"h5"}>Output Terms</b>
        <FormattedHtml text={problem.outTerms}/> <br/>
      </div>
      <table className="table table-bordered table-striped">
        <thead>
        <tr>
          <th>Input</th>
          <th>Output</th>
        </tr>
        </thead>
        <tbody>
        {problem.test_cases.map(test => <tr key={Math.floor(Math.random() * 1000)}>
          <td>
            <pre>{test.input}</pre>
          </td>
          <td>
            <pre>{test.output}</pre>
          </td>
        </tr>)}
        </tbody>
      </table>
      <ProblemCode problem={problem} />
      <br/><br/>
    </div>
  );
}

export default Problem;

