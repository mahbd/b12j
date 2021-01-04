import React, {Component} from 'react';

class Input extends Component {
    state = {
        value: this.props.value
    }

    render() {
        let {name, label, error, type, onChange, placeholder} = this.props;
        const changeMiddle = (data) => {
            onChange(data);
            this.setState({value: data.currentTarget.value})
        }
        return (
            <div className="form-group">
                {label &&
                <label htmlFor="{name}"><h3>{label}</h3></label>
                }
                <input type={type} value={this.state.value} onChange={changeMiddle} id={name} name={name} className="form-control"
                       autoComplete="off" placeholder={placeholder} />
                <p><small/></p>
                {error && <div className="alert alert-danger">{error}</div>}
            </div>
        )
    }
}

Input.defaultProps = {
    type: "text",
    placeholder: "Input here"
}

export default Input;
