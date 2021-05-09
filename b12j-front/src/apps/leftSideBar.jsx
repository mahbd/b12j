import React, {useContext} from 'react';
import {css} from "../main_css";
import {SuperContext} from "../context";
import {Link} from "react-router-dom";
import {urls} from "../configuration";

const LeftSideBar = () => {
    const {contestActs} = useContext(SuperContext);
    const contestList = contestActs.getList();
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
                    <tr>
                        <td><a className={"white-link"} href="#">First</a></td>
                    </tr>
                    <tr>
                        <td><a className={"white-link"} href="#">First</a></td>
                    </tr>
                    <tr>
                        <td><a className={"white-link"} href="#">First</a></td>
                    </tr>
                    <tr>
                        <td><a className={"white-link"} href="#">First</a></td>
                    </tr>
                    <tr>
                        <td><a className={"white-link"} href="#">First</a></td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default LeftSideBar;