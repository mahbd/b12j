import React from "react";

export const Table = ({ headers, body }) => (
  <table className="table table-bordered table-striped">
    <thead>
    <tr>
      {headers.map((cell) => (
        <th key={Math.floor(Math.random() * 10000)}>{cell}</th>
      ))}
    </tr>
    </thead>
    <tbody>
    {body.map((row) => (
      <tr key={Math.floor(Math.random() * 1000000) + Math.floor(Math.random() * 1000000)}>
        {row.map((cell) => (
          <td key={Math.floor(Math.random() * 1000000) + Math.floor(Math.random() * 1000000)}>{cell}</td>
        ))}
      </tr>
    ))}
    </tbody>
  </table>
);

export const Verdict = ({ verdict }) => {
  if (verdict === "AC") return <span className="text-success">Accepted</span>;
  if (verdict === "WA") return <span className="text-danger">Wrong Answer</span>;
  if (verdict === "CE") return <span className="text-danger">Compilation Error</span>;
  if (verdict === "TLE") return <span className="text-danger">Time Limit Exceed</span>;
  if (verdict === "PJ") return <span className="text-info">Judging.</span>;
  if (verdict === "FJ") return <span className="text-danger">Failed.</span>;
  return <span>Unknown verdict</span>;
};
