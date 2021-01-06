import React, {useContext, useEffect, useState} from 'react';
import {FormattedHtml} from "../../common/objectViewFuncs";
import {SuperContext} from "../../app";
import ProblemCode from "../../common/fields/problemCode";
import {Link} from "react-router-dom";
import {getCurrentUser} from "../../common/authService";

const Problem = ({match, history}) => {
    const {problemActs, userActs} = useContext(SuperContext);
    const {problemId} = match.params;
    const [problem, setProblem] = useState(problemActs.getById(problemId));
    const [reload, setReload] = useState(false);

    problemActs.store.subscribe(() => {
        setProblem(problemActs.getById(problemId));
        setReload(!reload);
    });

    const currentUser = getCurrentUser() && getCurrentUser().id;
    const is_admin = getCurrentUser() && getCurrentUser().is_superuser;

    useEffect(() => {
        setProblem(problemActs.getById(problemId));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [problemId]);

    return (
        problem && <div className="container">
            {(currentUser === problem.by || is_admin) &&
            <Link to={`/problems/edit/${problem.id}`}>
                <button className="btn-lg btn-success">Edit</button>
            </Link>}
            <div className="bgDarkBlue">
                <h1>{problem.title}</h1>
                <h3>By <span className="user">{userActs.fullName(problem.by)}</span></h3>
            </div>
            <div className="bgAliceBlue">
                <div className="alert alert-info">{problem.notice}</div>
                <h4>Problem statement</h4>
                <FormattedHtml text={problem.text}/> <br/>
                <h4>Input Terms</h4>
                <FormattedHtml text={problem.inTerms}/> <br/>
                <h4>Output Terms</h4>
                <FormattedHtml text={problem.outTerms}/> <br/>
            </div>
            <table className="table table-bordered">
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
            <ProblemCode problem={problem} history={history}/>
            <br/><br/>
        </div>
    );
}

export default Problem;

