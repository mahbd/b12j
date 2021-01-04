import React, {useContext, useState} from 'react';
import {Link} from "react-router-dom";
import {SuperContext} from "../../app";

const TutorialList = ({match}) => {
    const {contestId} = match.params;
    const {tutorialActs, userActs} = useContext(SuperContext);
    const [tutorials, setTutorials] = useState(tutorialActs.getList(contestId));

    let unSubscribe = tutorialActs.store.subscribe(() => {
        setTutorials(tutorialActs.getList(contestId));
        unSubscribe();
    });

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
                {tutorials.map((tutorial) => <tr key={tutorial.id}>
                    <td><Link to={`/tutorials/${tutorial.id}`}>{tutorial.title}</Link></td>
                    <td>{userActs.fullName(tutorial.by)}</td>
                </tr>)}
                </tbody>
            </table>
        </div>
    );
}

export default TutorialList;