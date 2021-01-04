import React, {Component} from 'react';
// import isAlphanumeric from "validator/es/lib/isAlphanumeric";
// import isAlpha from "validator/es/lib/isAlpha";
// import isNumeric from "validator/es/lib/isNumeric";
// import isEmail from "validator/es/lib/isEmail";
// import isLength from "validator/es/lib/isLength";
import Input from './fields/input';
import TextEditor from "./fields/TextEditor";
import Select from "./fields/select";

class BaseForm extends Component {
    validate = () => {
        // let haveError = false;
        // let errors = {}
        // for (let key in this.schema) {
        //     const data = this.state.data;
        //     const obj = {name: key, value: data[key]};
        //     errors[key] = this.validateProperty(obj);
        //     if (errors[key]) {
        //         haveError = true;
        //     }
        // }
        // if (haveError) {
        //     return errors;
        // }
        // return null;
    }

    validateProperty = ({name, value}) => {
        // const schemaElement = this.schema[name];
        // if (schemaElement) {
        //     let label;
        //     schemaElement.label ? label = schemaElement.label : label = name;
        //     if (schemaElement.length) {
        //         if (!isLength(value, schemaElement.length)) {
        //             return `${label} length must be between ${schemaElement.length.min} and ${schemaElement.length.max || "infinite"}`
        //         }
        //     }
        //     if (schemaElement.email) {
        //         if (!isEmail(value)) return `${label} is not a valid Email.`
        //     }
        //     if (schemaElement.alphanumeric) {
        //         if (!isAlphanumeric(value)) return `${label} can be only letter and number.`
        //     }
        //     if (schemaElement.number) {
        //         if (!isNumeric(value)) return `${label} should contain only number.`
        //     }
        //     if (schemaElement.alpha) {
        //         if (!isAlpha(value)) return `${label} should contain only letter.`
        //     }
        //     return null;
        // }
        // return null;
    }

    handleSubmit = e => {
        e.preventDefault();
        const errors = this.validate();
        console.log(errors);
        this.setState({errors: errors || {}});
        if (errors) return;
        this.doSubmit()
    }

    handleChange = ({currentTarget: input}) => {
        const errors = {...this.state.errors};
        const errorMessage = this.validateProperty(input);
        if (errorMessage) errors[input.name] = errorMessage;
        else delete errors[input.name];
        const data = {...this.state.data};
        data[input.name] = input.value;
        this.setState({data, errors});
    }

    handleChangeArray = ({currentTarget: input}) => {
        const options = input.options;
        const value = [];
        let i = 0, l = options.length;
        for (; i < l; i++) {
            if (options[i].selected) {
                value.push(options[i].value);
            }
        }
        const object = {currentTarget: {value: value, name: input.name}}
        this.handleChange(object)
    }

    renderButton(label) {
        return (
            <button disabled={this.validate()} onClick={this.handleSubmit} className="btn btn-primary">{label}</button>)
    }


    renderInput(name, label, type = 'text') {
        const {data, errors} = this.state;

        return <Input
            name={name}
            value={data[name]}
            label={label}
            onChange={this.handleChange}
            error={errors[name]}
            type={type}
        />
    }

    renderSelect(name, label, options, multiple = false) {
        const {data, errors} = this.state;

        return (
            <Select
                name={name}
                value={data[name]}
                label={label}
                options={options}
                multiple={multiple}
                onChange={multiple ? this.handleChangeArray: this.handleChange}
                error={errors[name]}
            />
        );
    }

    renderEditor(name, label) {
        return <TextEditor
            label={label}
            name={name}
            value={data[name]}
            onChange={this.handleChange}
        />
    }
}

export default BaseForm;