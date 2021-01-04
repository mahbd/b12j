import React, {useState, useContext, useEffect} from 'react';
import {SuperContext} from "../../app";
import {Link} from "react-router-dom";
import {extractDate} from "../functions";

const ContestList = () => {
    const {contestActs, userActs} = useContext(SuperContext);
    const [contestList, setContestList] = useState(contestActs.getList());

    useEffect(() => {
    contestActs.store.subscribe(() => {
        setContestList(contestActs.getList());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    });}, []);

    return (
        <div className="container">
            <table className="table table-bordered table-striped">
                <thead>
                <tr>
                    <th>Name</th>
                    <th>Writers</th>
                    <th>Testers</th>
                    <th>Start</th>
                    <th>End</th>
                </tr>
                </thead>
                <tbody>
                {contestList && contestList.map((contest) => <tr key={contest.id}>
                    <td><Link to={`/contests/${contest.id}`}>{contest.title}</Link></td>
                    <td>{contest.hosts.map((userId) => <p className="user" key={userId}>{userActs.firstName(userId)}</p> )}</td>
                    <td>{contest.testers.map((userId) => <p className="user" key={userId}>{userActs.firstName(userId)}</p> )}</td>
                    <td>{extractDate(contest.start_time)}</td>
                    <td>{extractDate(contest.end_time)}</td>
                </tr>)
                }
                </tbody>
            </table>
        </div>
    );
}

export default ContestList;