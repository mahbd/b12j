import React, {useContext} from 'react';
import {css} from "../main_css";
import {SuperContext} from "../context";
import {Link} from "react-router-dom";
import {urls} from "../configuration";

const LeftSideBar = () => {
    const {contestActs, tutorialActs} = useContext(SuperContext);
    const tutorials = tutorialActs.getList();
    let contestList = contestActs.getList();
    contestList = contestList.slice(0, Math.min(contestList.length, 5))
    return (
        <div>
            <div className={"width-100 d-none d-lg-block float-start p-2"}>
                <div className={css.heading4}>Latest Contests</div>
                <table className={css.tableSingle}>
                    <tbody>
                    {contestList.map(contest =>
                        <tr key={contest.id}>
                            <td><Link to={`${urls.contests}/${contest.id}`}
                                      className={"white-link"}>{contest.title}</Link></td>
                        </tr>
                    )}
                    </tbody>
                </table>

                <span className="p-2"/>
                <div className={css.heading4}>Latest Tutorials</div>
                <table className={css.tableSingle}>
                    <tbody>
                    {tutorials.map(tutorial =>
                    <tr key={tutorial.id}>
                        <td><Link className={"white-link"} to={`/tutorials/${tutorial.id}`}>{tutorial.title}</Link></td>
                    </tr>)}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default LeftSideBar;