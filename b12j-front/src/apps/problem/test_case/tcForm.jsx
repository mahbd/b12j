import React, {useContext, useState} from 'react';
import {SuperContext} from "../../../app";

const TcForm = ({match}) => {
    const {problemId} = match.params;
    const {problemActs} = useContext(SuperContext);
    const [problem, setProblem] = useState(problemActs.getById(problemId));

    let unSubscribe = problemActs.store.subscribe(() => {
        setProblem(problemActs.getById(problemId));
        unSubscribe();
    })

    return (
        <div className="container">
            {problem &&
            <div>

            </div>
            }
        </div>
    );
};

export default TcForm;