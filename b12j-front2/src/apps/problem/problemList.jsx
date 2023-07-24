import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { SuperContext } from "../../context";
import { pagination } from "../../components/helperFunctions";
import { urls } from "../../configuration";
import { Table } from "../../components/customTags";

const ProblemList = ({ match }) => {
   const page = parseInt(match.params.page) || 1;
   const { problemActs } = useContext(SuperContext);
   let problems = problemActs.getListPage(page);
   const pages = problemActs.totalPages();

   return (
      <div className="container">
         {renderProblemList(problems, urls.problems)}
         {pagination(`${urls.problems}/page=`, pages, page)}
      </div>
   );
};

export default ProblemList;

export function renderProblemList(problems) {
   const data = [];
   for (let problem of problems) {
      if (problem)  {
         data.push([<Link to={`${urls.problems}/${problem.id}`}>{problem.title}</Link>, problem.difficulty]);
      }
   }
   return <Table headers={["Name", "Difficulty"]} body={data} />;
}
