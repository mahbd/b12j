import React, {useContext, useEffect, useState} from 'react';
import http from "../../common/httpService";
import {Link} from "react-router-dom";
import {logout} from "../../common/authService";
import {apiEndpoint} from "../../configuration";
import {SuperContext} from "../../context";

const Profile = () => {
    const {problemActs} = useContext(SuperContext);
    const [userProbList, setUserProbList] = useState([]);
    const [userSubmissionList, setUserSubmissionList] = useState([]);
    const [userContest, setUserContest] = useState([]);
    const [testProblem, setTestProblem] = useState([]);

    // useEffect(() => {
    //     const apiCall = async () => {
    //         problemActs.start(); // Start Load animation
    //         const userProblemData = await http.get(`${apiEndpoint}/problems/user_problems/`);
    //         const userSubmissionData = await http.get(`${apiEndpoint}/submissions/user_submissions/`);
    //         const userContestData = await http.get(`${apiEndpoint}/contests/user_contests/`);
    //         const testProblemData = await http.get(`${apiEndpoint}/problems/test_problems/`);
    //         problemActs.failure(); // Stop Load animation
    //         setUserProbList(userProblemData.data.results);
    //         setUserSubmissionList(userSubmissionData.data.results);
    //         setUserContest(userContestData.data.results);
    //         setTestProblem(testProblemData.data.results);
    //     }
    //     apiCall();
    //     // eslint-disable-next-line
    // }, [])
    return (
        <div className="container pt-5">
            <button className="btn btn-danger" onClick={() => logout('/')}>Logout</button>
            <a className="btn btn-success" href={"/users/password_change/"}>Change Password</a>
            <div className="row">
                <div className="col-sm">
                    <b>Contest set by you</b>
                    <table className="table table-striped table-bordered">
                        <thead>
                        <tr>
                            <th>Title</th>
                            <th/>
                        </tr>
                        </thead>
                        <tbody>
                        {userContest.map(contest => <tr key={contest.id}>
                            <td><Link to={`/contests/${contest.id}`}>{contest.title}</Link></td>
                            <td><Link to={`/problems/add/${contest.id}`} className="btn-sm btn-success">Add
                                problem</Link></td>
                        </tr>)}
                        </tbody>
                    </table>
                </div>
                <div className="col-sm">
                    <b>Testable problem for you</b>
                    <table className="table table-bordered table-striped">
                        <thead>
                        <tr>
                            <th>Title</th>
                            <th>Contest</th>
                        </tr>
                        </thead>
                        <tbody>
                        {testProblem.map(problem => <tr key={problem.id}>
                            <td><Link to={`/problems/${problem.id}`}>{problem.title}</Link></td>
                            <td>{problem.contest}</td>
                        </tr>)}
                        </tbody>
                    </table>
                </div>
            </div>
            <div className="row">
                <div className="col-sm">
                    <b>Last 20 Problem set by you</b>
                    <table className="table table-bordered table-striped">
                        <thead>
                        <tr>
                            <th>Title</th>
                            <th>Contest</th>
                        </tr>
                        </thead>
                        <tbody>
                        {userProbList.map(problem => <tr key={problem.id}>
                            <td><Link to={`/problems/${problem.id}`}>{problem.title}</Link></td>
                            <td>{problem.contest}</td>
                        </tr>)}
                        </tbody>
                    </table>
                </div>
                <div className="col-sm">
                    <b>Last 20 submissions by you</b>
                    <table className="table table-bordered table-striped">
                        <thead>
                        <tr>
                            <th>Contest</th>
                            <th>Problem</th>
                            <th>Verdict</th>
                        </tr>
                        </thead>
                        <tbody>
                        {userSubmissionList.map(submission => <tr key={submission.id}>
                            <td>{submission.contest}</td>
                            <td>{submission.problem}</td>
                            <td><Link to={`/submissions/${submission.id}`}>{submission.verdict}</Link></td>
                        </tr>)}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Profile;