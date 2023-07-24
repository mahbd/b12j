import React from "react";
import dayjs from "dayjs";

const Input = ({ name, label, error, ...rest }) => {
  if (rest['type'] === "datetime-local") {
    if (rest['value']) {
      rest['value'] = dayjs(rest['value']).format("YYYY-MM-DDTHH:MM")
    }
  }
  return (
    <div className="form-group">
      <label htmlFor={name}>{label}</label>
      <input {...rest} name={name} id={name} className="form-control" />
      {error && <div className="alert alert-danger">{error}</div>}
    </div>
  );
};

export default Input;