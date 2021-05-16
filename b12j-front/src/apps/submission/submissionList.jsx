import React, {useContext} from 'react';
import {Link} from "react-router-dom";
import {SuperContext} from "../../context";

const SubmissionList = ({match}) => {
    const page = parseInt(match.params.page) || 1;
    const {submissionActs, userActs} = useContext(SuperContext);
    const submissionList = submissionActs.getList(page);

    const pages = submissionActs.totalPages();

    return (
        <div className="container pt-2">
            <table className="table table-bordered table-striped">
                <thead>
                <tr>
                    <th className={"bg-dark rounded-3 text-white"}>Id</th>
                    <th className={"bg-dark rounded-3 text-white"}>By</th>
                    <th className={"bg-dark rounded-3 text-white"}>Problem</th>
                    <th className={"bg-dark rounded-3 text-white"}>Verdict</th>
                </tr>
                </thead>
                <tbody>
                {submissionList.map((submission) => <tr key={submission.id}>
                    <td><Link to={`/submissions/${submission.id}`}>{submission.id}</Link></td>
                    <td>{userActs.fullName(submission.by)}</td>
                    <td>{submission.problem_title}</td>
                    <td>{submission.verdict}</td></tr>)}
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
