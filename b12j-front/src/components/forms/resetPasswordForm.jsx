import React from "react";
import Joi from "joi";
import { apiEndpoint, serverUrls, urls } from "../../configuration";
import { startLoading } from "../loadingAnimation";
import httpService from "../httpService";
import BaseForm from "./baseForms";

class ResetPasswordForm extends BaseForm {
  state = {
    data: {},
    errors: {}
  };
  schema = {
    new_password: Joi.string().required(),
    re_new_password: Joi.string().required(),
  };

  doSubmit = async () => {
    const { history, uid, token } = this.props;
    const { new_password, re_new_password } = this.state.data;
    const data = { uid, token, new_password, re_new_password };
    startLoading("Resetting password");
    try {
      const response = await httpService.post(`${apiEndpoint}${serverUrls.resetPasswordConfirm}/`, data);
      startLoading("Reset Successful. Redirecting...")
      setTimeout(() => {
        history.push(urls.login);
      }, 1000)
      history.push(`/submissions/${response.data.id}`);
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        const errors = {...this.state.errors, ...ex.response.data};
        this.setState({ errors });
        console.log(ex)
      }
    }
  };

  render() {
    return (
      <div className={"container"}>
        <form className={"one-form"} onSubmit={this.handleSubmit} method={"post"}>
          {this.renderNonFieldError()}
          {this.renderInput("new_password", "New Password", "password")}
          {this.renderInput("re_new_password", "Type Password Again", "password")}
          {this.renderSubmitButton("Set Password")}
        </form>
      </div>
    );
  }
}

export default ResetPasswordForm;