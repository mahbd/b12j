import React from "react";
import BaseForm from "./baseForms";
import { renderColX } from "../helperFunctions";
import Joi from "joi";
import { serverUrls, urls } from "../../configuration";

class TutorialForm extends BaseForm {
  state = {
    data: {},
    errors: {},
  }
  schema = {
    title: Joi.string().min(5).max(255),
    hidden_till: Joi.date(),
    contest: Joi.number().min(1).required(),
    problem: Joi.number().min(1).required(),
    text: Joi.string().min(100).required(),
  }

  componentDidMount() {
    if (this.props.tutorial) {
      this.setState({ data: { ...this.state.data, ...this.props.tutorial } });
    }
  }

  doSubmit = () => {
    this.doSubmitHelper(serverUrls.tutorials, urls.tutorials, "Saving Tutorial");
  };

  render() {
    const {contests, problems} = this.props;
    return (
      <form method={"post"} onSubmit={this.handleSubmit}>
        {this.renderInput("title", "Tutorial Title")}
        {this.renderInput("hidden_till", "When will be published", "datetime-local")}
        {renderColX([
          this.renderAutoCompleteSelect("contest", "Contest", contests, "id", "title"),
          this.renderAutoCompleteSelect("problem", "Problem", problems, "id", "title"),
        ])}
        {this.renderTextEditor("text", "Tutorial Body")}
        {this.renderSubmitButton("Submit Tutorial")}
      </form>
    );
  }
}

export default TutorialForm;