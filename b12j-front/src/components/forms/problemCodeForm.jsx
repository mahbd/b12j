import React from "react";
import BaseForm from "./baseForms";
import Joi from "joi";
import { renderColX } from "../helperFunctions";
import { getCurrentUser } from "../authService";
import { startLoading } from "../loadingAnimation";
import { apiEndpoint, serverUrls, urls } from "../../configuration";
import httpService from "../httpService";

class ProblemCodeForm extends BaseForm {
  state = {
    data: { language: localStorage.getItem("language") || "python", theme: "chrome", font: "15px" },
    errors: {}
  };

  schema = {
    code: Joi.string().required(),
    language: Joi.required(),
    theme: Joi.required(),
    font: Joi.required()
  };

  user = getCurrentUser();
  doSubmit = async () => {
    const { history, contestId, problem } = this.props;
    const { code, language } = this.state.data;
    localStorage.setItem("language", language);
    if (!this.user) {
      history.push(urls.login);
    }
    const data = { code, language, problem: problem.id };
    if (contestId) data["contest"] = contestId;

    startLoading("Submitting Code");
    try {
      const response = await httpService.post(`${apiEndpoint}${serverUrls.submissions}/`, data);
      this.props.history.push(`/submissions/${response.data.id}`);
    } catch (error) {
      if (error.response && error.response.status === 403) {
        window.location.reload();
      }
    }
  };

  render() {
    return (<div>
      {!this.user && <div className="alert alert-danger">You must login to see code editor</div>}
      {this.user && <form method={"post"} onSubmit={this.handleSubmit}>
        {renderColX([
          this.renderSelect("theme", "Select theme",
            [{ value: "chrome", name: "White" }, { value: "gob", name: "Dark" }]),
          this.renderSelect("language", "Select language",
            [{ value: "python", name: "Python3.9" }, { value: "c_cpp", name: "C/C++" }]),
          this.renderSelect("font", "Select font",
            [{ value: "12px", name: "12px" },
              { value: "15px", name: "15px" },
              { value: "18px", name: "18px" },
              { value: "20px", name: "20px" }])
        ])}
        {this.renderCodeEditor("code")}
        {this.renderSubmitButton("Submit")}
      </form>}
    </div>);
  }
}

export default ProblemCodeForm;