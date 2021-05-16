import React from 'react';
import {css} from "../main_css";

const RightSideBar = () => {
  return (
    <div>
      <div className="width-100 d-none d-xxl-block float-end">
        <div className={css.heading4}>Latest News</div>
        <table className={css.tableSingle}>
          <tbody>
          <tr>
            <td>Nice to know</td>
          </tr>
          <tr>
            <td>Now working</td>
          </tr>
          <tr>
            <td>Continue</td>
          </tr>
          </tbody>
        </table>

        <div className={css.heading4}>Top solvers</div>
        <table className={css.tableSingle}>
          <tbody>
          <tr>
            <td>Mahmudul Alam</td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RightSideBar;