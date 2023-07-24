import React from "react";
import Joi from "joi";
import { startLoading } from "../loadingAnimation";
import httpService from "../httpService";
import { apiEndpoint, serverUrls } from "../../configuration";
import BaseForm from "./baseForms";

class ChangePasswordForm extends BaseForm {
  state = {
    data: { },
    errors: {}
  };
  schema = {
    new_password: Joi.string().min(4).max(10),
    current_password: Joi.string().required().min(4).max(32)
  };

  doSubmit = async () => {
    try {
      startLoading("Changing username");
      await httpService.post(`${apiEndpoint}${serverUrls.changePassword}/`, this.state.data);
      window.location.reload();
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        const errors = { ...this.state.errors, ...ex.response.data };
        this.setState({ errors });
        console.log(ex);
      }
    }
  };

  render() {
    return (
      <form onSubmit={this.handleSubmit} method={"post"}>
        {this.renderNonFieldError()}
        {this.renderInput("new_password", "New Password")}
        {this.renderInput("current_password", "Current Password", "password")}
        {this.renderSubmitButton("Change Password")}
      </form>
    );
  }
}

export default ChangePasswordForm;