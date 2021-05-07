import React, {useContext, useEffect, useState} from 'react';
import {Link} from "react-router-dom";
import {SuperContext} from "../../context";

const SubmissionList = ({match}) => {
    const page = parseInt(match.params.page) || 1;
    const {submissionActs, userActs} = useContext(SuperContext);
    const [submissionList, setSubmissionList] = useState(submissionActs.getList(page));

    useEffect(() => {
        setSubmissionList(submissionActs.getList(page));
        // eslint-disable-next-line
    }, [page])

    const pages = submissionActs.totalPages();

    return (
        <div className="container">
            <table className="table table-bordered table-striped">
                <thead>
                <tr>
                    <th>Problem</th>
                    <th>Verdict</th>
                    <th>By</th>
                </tr>
                </thead>
                <tbody>
                {submissionList.map((submission) => <tr key={submission.id}>
                    <td><Link to={`/submissions/${submission.id}`}>{submission.problem_title}</Link></td>
                    <td>{submission.verdict}</td>
                    <td>{userActs.firstName(submission.by)}</td></tr>)}
                </tbody>
            </table>
            {pagination('/submissions/page=', pages, page)}
        </div>
    );
};

export default SubmissionList;

export const pagination = (url, pages=1, page=1) => {
    let pageList = []
    if(page > 2) {
        for(let i = page - 2; i <= pages && i <= page + 2; i++) pageList.push(i);
    } else {
        for(let i = 1; i <= pages && i <= 5; i++) pageList.push(i);
    }
    return <ul className="pagination">
        {pageList.map(page => <li key={page} className="page-item">
            <Link className="page-link" to={url + page.toString()} >{page}</Link>
        </li>)}
    </ul>
}
