import React, {useContext} from 'react';
import {Link} from "react-router-dom";
import {SuperContext} from "../../context";

const TutorialList = () => {
    const {tutorialActs, userActs} = useContext(SuperContext);
    const tutorials = tutorialActs.getList();

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