import React, {useContext, useState} from 'react';
import {Link} from "react-router-dom";
import {SuperContext} from "../../context";

const ProblemList = () => {
  const {problemActs} = useContext(SuperContext);
  let problems = problemActs.getList();

  return (
    <div className="container">
      <table className="table table-bordered table-striped">
        <thead>
        <tr>
          <th>Name</th>
          <th>Difficulty</th>
        </tr>
        </thead>
        <tbody>
        {problems.map((problem) => <tr key={problem.id}>
          <td><Link to={`/problems/${problem.id}`}>{problem.title}</Link></td>
          <td>{problem.difficulty}</td>
        </tr>)}
        </tbody>
      </table>
    </div>
  );
}

export default ProblemList;