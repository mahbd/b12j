import React from "react";
import BaseForm from "./baseForms";
import Joi from "joi";
import httpService from "../httpService";
import { apiEndpoint, serverUrls } from "../../configuration";
import { startLoading } from "../loadingAnimation";
import { getCurrentUser } from "../authService";

class ChangeUsernameForm extends BaseForm {
  state = {
    data: {new_username: getCurrentUser().username},
    errors: {}
  };
  schema = {
    new_username: Joi.string().alphanum().min(4).max(10),
    current_password: Joi.string().required().min(4).max(32)
  };

  doSubmit = async () => {
    try {
      startLoading("Changing username");
      await httpService.post(`${apiEndpoint}${serverUrls.changeUsername}/`, this.state.data);
      console.log(`${apiEndpoint}${serverUrls.updateUser}/`)
      window.location.reload();
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        const errors = { ...this.state.errors, ...ex.response.data };
        this.setState({ errors });
        console.log(ex)
      }
    }
  };

  render() {
    return (
      <form onSubmit={this.handleSubmit} method={"post"}>
        {this.renderNonFieldError()}
        {this.renderInput("new_username", "New Username")}
        {this.renderInput("current_password", "Current Password", "password")}
        {this.renderSubmitButton("Change Username")}
      </form>
    );
  }
}

export default ChangeUsernameForm;