import React, { useContext } from "react";
import { css } from "../../main_css";
import { SuperContext } from "../../context";
import { Link } from "react-router-dom";
import { urls } from "../../configuration";
import { Table } from "../../components/customTags";

const LeftSideBar = () => {
   const { contestActs, tutorialActs } = useContext(SuperContext);
   let tutorials = tutorialActs.getListPage(1);
   let contestList = contestActs.getListPage(1);
   contestList = contestList.slice(0, Math.min(contestList.length, 5));
   tutorials = tutorials.slice(0, Math.min(tutorials.length, 5));
   let contestData = [],
      tutorialData = [];

   for (let contest of contestList) {
      contestData.push([
         <Link to={`${urls.contests}/${contest.id}`} className={"white-link"}>
            {`${contest.title.slice(0, 25)}${contest.title.length > 25 ? "...": ""}`}
         </Link>,
      ]);
   }
   for (let tutorial of tutorials) {
      tutorialData.push([
         <Link className={"white-link"} to={`/tutorials/${tutorial.id}`}>
            {tutorial.title.slice(0, 15)}
         </Link>,
      ]);
   }

   return (
      <div>
         <div className={"d-none d-lg-block float-start m-2"} style={{width: "100%"}}>
            <div className={css.heading4}>Latest Contests</div>
            <Table headers={[]} body={contestData} />

            <div className={css.heading4 + " mt-2"}>Latest Tutorials</div>
            <Table headers={[]} body={tutorialData} />
         </div>
      </div>
   );
};

export default LeftSideBar;
