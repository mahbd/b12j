import React, {useContext, useState} from 'react';
import {Link} from "react-router-dom";
import {SuperContext} from "../../context";

const ProblemList = ({match}) => {
    const {contestId} = match.params;
    const {problemActs, userActs} = useContext(SuperContext);
    const [problems] = useState(problemActs.getList(contestId));

    return (
        <div className="container">
            <table className="table table-bordered table-striped">
                <thead>
                <tr>
                    <th>Name</th>
                    <th>Writer</th>
                </tr>
                </thead>
                <tbody>
                {problems.map((problem) => <tr key={problem.id}>
                    <td><Link to={`/problems/${problem.id}`}>{problem.title}</Link></td>
                    <td>{userActs.fullName(problem.by)}</td>
                </tr>)}
                </tbody>
            </table>
        </div>
    );
}

export default ProblemList;