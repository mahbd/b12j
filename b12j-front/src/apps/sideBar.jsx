import React from 'react';
import {css} from "../main_css";

const SideBar = () => {
  return (
    <React.Fragment>
      <div className={"width-100 d-none d-lg-block float-start p-2"}>
        <div className={css.heading4}>Latest Contests</div>
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



      <div className="width-100 d-none d-xxl-block float-end vll">
        <h1>This is asdf gasd dsa situated on right</h1>
      </div>
    </React.Fragment>
  );
};

export default SideBar;