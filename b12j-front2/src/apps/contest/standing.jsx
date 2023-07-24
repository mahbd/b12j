import React, { useContext, useEffect, useState } from "react";
import http from "../../components/httpService";
import { apiEndpoint } from "../../configuration";
import { SuperContext } from "../../context";
import { Table } from "../../components/customTags";

const Standing = ({ match }) => {
   const { userActs } = useContext(SuperContext);
   const { contestId } = match.params;
   const [duringContest, setDuringContest] = useState([]);
   const [afterContest, setAfterContest] = useState([]);
   useEffect(() => {
      // ToDo: Start loading animation
      const apiCall = async () => {
         const data = await http.get(`${apiEndpoint}/standing/${contestId}`);
         setDuringContest(data.data.during);
         setAfterContest(data.data.after);
      };
      apiCall();
   }, [contestId]);

   return (
      <div className="container m-2">
         <h2>During Contest</h2>
         <StandingTable position={1} objectList={duringContest} userActs={userActs} />
         <h2>After Contest</h2>
         <StandingTable position={duringContest.length + 1} objectList={afterContest} userActs={userActs} />
      </div>
   );
};

export default Standing;

const StandingTable = ({ objectList, userActs, position = 1 }) => {
   const data = [];
   for (let x of objectList) {
      data.push([position++, userActs.fullName(x[0]), x[1], Math.floor(parseFloat(x[2]) / 100)]);
   }
   return <Table headers={["Position", "User", "Solves", "Penalty"]} body={data} />;
};
