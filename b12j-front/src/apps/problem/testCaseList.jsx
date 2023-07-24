import React, { useContext, useEffect, useState } from "react";
import { SuperContext } from "../../context";
import { Table } from "../../components/customTags";
import httpService from "../../components/httpService";
import { apiEndpoint, serverUrls } from "../../configuration";

const TestCaseList = ({ match }) => {
  const { problemId } = match.params;
  const { problemActs } = useContext(SuperContext);
  const problem = problemActs.getById(problemId);
  const [data, setData] = useState([]);

  useEffect(() => {
    httpService.get(`${apiEndpoint}${serverUrls.test_cases}/?problem_id=${problemId}`).then(res => {
      const tests = []
      for (let test of res.data.results) {
        tests.push([<pre>{test.inputs}</pre>, <pre>{test.output}</pre>]);
      }
      setData(tests);
    });
  }, [problemId]);

  return (
    problem && <div>
      <Table headers={["Input", "Output"]} body={data} />
    </div>
  );
};

export default TestCaseList;