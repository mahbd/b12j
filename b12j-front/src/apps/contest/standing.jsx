import React, {useContext, useEffect, useState} from 'react';
import http from "../../common/httpService";
import {apiEndpoint} from "../../configuration";
import {SuperContext} from "../../context";

const url = apiEndpoint

const Standing = ({match}) => {
    const {contestActs, userActs} = useContext(SuperContext);
    const {contestId} = match.params;
    const [duringContest, setDuringContest] = useState([]);
    const [afterContest, setAfterContest] = useState([]);
    useEffect(() => {
        const apiCall = async () => {
            contestActs.start(); // Start Load animation
            const data = await http.get(`${url}/standing/${contestId}`)
            contestActs.failure(); // Stop Load animation
            setDuringContest(data.data.during);
            setAfterContest(data.data.after);
        }
        apiCall();

    }, [contestId])
    let position = 1;

    return (
        <div className="container">
            <h2>During Contest</h2>
            {renderStanding(duringContest, userActs, position)}
            <h2>After Contest</h2>
            {renderStanding(afterContest, userActs, position)}
        </div>
    );
};

export default Standing;

const renderStanding = (objectList, userActs, position = 1) =>
    <table className="table table-bordered table-striped">
        <thead>
        <tr>
            <th>Position</th>
            <th>User</th>
            <th>Solves</th>
            <th>Penalty</th>
        </tr>
        </thead>
        <tbody>
        {objectList.map(item => <tr key={position}>
            <td>{position++}</td>
            <td>{userActs.fullName(item[0])}</td>
            <td>{item[1]}</td>
            <td>{Math.floor(parseFloat(item[2]) / 100)}</td>
        </tr>)}
        </tbody>

    </table>
