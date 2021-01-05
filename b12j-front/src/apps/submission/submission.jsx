import React, {useContext, useState} from 'react';
import {SuperContext} from "../../app";
import {getCurrentUser} from "../../common/authService";

const Submission = ({match}) => {
    const {submissionId} = match.params;
    const {submissionActs, userActs, contestActs, problemActs} = useContext(SuperContext);
    const [submission, setSubmission] = useState(submissionActs.getById(submissionId));
    const [contest, setContest] = useState(contestActs.getById(submission && submission.contest))
    const [reload, setReload] = useState(false);

    let unSubscribe = submissionActs.store.subscribe(() => {
        setSubmission(submissionActs.getById(submissionId));
        setContest(contestActs.getById(submission && submission.contest))
        unSubscribe();
        setReload(!reload);
    })

    const contestEnd = new Date((contest && contest.end_time) || Date.now().toLocaleString());
    const currentUser = getCurrentUser() && getCurrentUser().id;

    return (
        <div className="container">
            {submission && <div>
                <div><h5>Submitter: {userActs.fullName(submission.by)}</h5></div>
                <div><h5>Contest: {contestActs.getById(submission.contest, 'title')}</h5></div>
                <div><h5>Problem: {problemActs.getById(submission.problem, 'title')}</h5></div>
                <div><h5 className="text-nowrap">Verdict: {verdictProcess(submission.verdict)}</h5></div>
                {contest && <div>
                {(contestEnd <= Date.now() || submission.by === currentUser) && <span>
                <div><h5>Your Code:</h5>
                    <pre className="bg-light text-primary">{submission.code}</pre>
                </div>
                    {renderResult(submission.details, submission.verdict)}
                </span>}
                {(contestEnd > Date.now() && submission.by !== currentUser) &&
                <h2 className="text-danger">You can't see full info during contest</h2>
                }
                </div>}

            </div>}
        </div>
    );
};

export default Submission;

const renderResult = (result, verdict) => {
    const data = JSON.parse(result);
    if (!data) return;
    return <div>
        <div>
            <h5>Message: <pre>{data[0]}</pre></h5>
        </div>
        {verdict !== 'CE' && <table className="table table-bordered table-responsive">
            <thead>
            <tr>
                <td>Input</td>
                <td>Output</td>
                <td>Correct Output</td>
            </tr>
            </thead>
            <tbody>
            {data[1].map((item) => <tr>
                <td>
                    <pre>{item[0]}</pre>
                </td>
                <td>
                    <pre>{item[1]}</pre>
                </td>
                <td>
                    <pre>{item[2]}</pre>
                </td>
            </tr>)}
            </tbody>
        </table>}
    </div>
}

const verdictProcess = verdict => {
    if (verdict === 'AC') return <span className="text-success">Accepted</span>
    if (verdict === 'WA') return <span className="text-danger">Wrong Answer</span>
    if (verdict === 'CE') return <span className="text-danger">Compilation Error</span>
    if (verdict === 'TLE') return <span className="text-danger">Time Limit Exceed</span>
    if (verdict === 'PJ') return <span className="text-info">Judging. May take upto minute</span>
    if (verdict === 'FJ') return <span className="text-danger">Failed. Judges are offline</span>
    return <span>Unknown verdict</span>
}