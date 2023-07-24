import React from "react";
import BaseForm from "./baseForms";
import Joi from "joi";

class EmailForm extends BaseForm {
  state = {
    data: {},
    errors: {}
  };
  schema = {
    email: Joi.string().email({ tlds: { allow: ["com", "edu"] } }).label("Email Address")
  };

  render() {
    return (
      <div className={"container"}>
        <form className={"one-form"} onSubmit={this.handleSubmit} method={"post"}>
          {this.renderInput("email", "Email Address", "email")}
          {this.renderSubmitButton("Confirm")}
        </form>
      </div>
    );
  }
}

export default EmailForm;