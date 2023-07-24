import React from "react";
import BaseForm from "./baseForms";
import Joi from "joi";
import { renderColX } from "../helperFunctions";
import { serverUrls, urls } from "../../configuration";

class ProblemForm extends BaseForm {
  state = {
    data: {},
    errors: {}
  };
  schema = {
    title: Joi.string().required().min(5).max(255),
    description: Joi.string().required().min(50),
    input_terms: Joi.string().required().min(50),
    output_terms: Joi.string().required().min(50),
    hidden_till: Joi.date(),
    correct_code: Joi.string().required(),
    correct_lang: Joi.required(),
    memory_limit: Joi.number(),
    time_limit: Joi.number(),
    difficulty: Joi.number().min(500).max(1500),
    example_number: Joi.number().min(1).max(3),
    notice: Joi.string(),
    font: Joi.string(),
    theme: Joi.string()
  };

  componentDidMount() {
    if (this.props.problem) {
      this.setState({ data: { ...this.state.data, ...this.props.problem } });
    }
  }

  doSubmit = () => {
    this.doSubmitHelper(serverUrls.problems, urls.problems, "Saving Problem");
  };

  languageOptions = [
    { name: "Python3.10", value: "python" },
    { name: "C/C++", value: "c_cpp" }
  ];
  memoryLimitOptions = [
    { name: "256 MB", value: 256 },
    { name: "512 MB", value: 512 },
    { name: "1024 MB", value: 1024 }
  ];
  timeLimitOptions = [
    { name: "1 second", value: 1 },
    { name: "2 seconds", value: 2 },
    { name: "3 seconds", value: 3 },
    { name: "4 seconds", value: 4 }
  ];

  render() {
    return (
      <form onSubmit={this.handleSubmit} method={"post"}>
        {this.renderNonFieldError()}
        {this.renderInput("title", "Title")}
        {this.renderTextEditor("description", "Description")}
        {this.renderTextEditor("input_terms", "Input Terms")}
        {this.renderTextEditor("output_terms", "Output Terms")}
        {this.renderInput("hidden_till", "Hidden Till", "datetime-local")}
        {renderColX([
          this.renderSelect("theme", "Theme",
            [{ value: "chrome", name: "White" }, { value: "gob", name: "Dark" }]),
          this.renderSelect("correct_lang", "Language(required)", this.languageOptions),
          this.renderSelect("font", "Font",
            [{ value: "12px", name: "12px" },
              { value: "15px", name: "15px" },
              { value: "18px", name: "18px" },
              { value: "20px", name: "20px" }])
        ])}
        {this.renderCodeEditor("correct_code", "Correct Code", "correct_lang")}
        {renderColX([
          this.renderSelect("memory_limit", "Memory Limit", this.memoryLimitOptions),
          this.renderSelect("time_limit", "Time Limit", this.timeLimitOptions)
        ])}
        {renderColX([
          this.renderInput("difficulty", "Difficulty", "number"),
          this.renderInput("example_number", "Number of Example", "number")
        ])}
        {this.renderTextEditor("notice", "Problem Notice Board")}
        {this.renderSubmitButton("Submit Problem")}
      </form>
    );
  }
}

export default ProblemForm;