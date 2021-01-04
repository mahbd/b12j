import React, {Fragment} from 'react';

const Select = ({name, label, options, onChange, multiple = false, error, value}) => {
    return (
        <Fragment>
            <div className="form-group">
                <label htmlFor={name}>{label}</label>
                <select data-live-search="true" multiple={multiple} name={name} id={name} value={value}
                        onChange={onChange}
                        className="selectpicker form-control AliceBlue">
                    <option value=""/>
                    {options.map(option => (
                        <option key={option.id} data-tokens={option.title} value={option.id}>
                            {option.title}
                        </option>
                    ))}
                </select>
                {error && <div className="alert alert-danger">{error}</div>}
            </div>
            {window.$(`#${name}`).selectpicker('refresh') && false}
        </Fragment>
    );
};

export default Select;

export const SelectSimple = ({name, label, options, onChange}) => {
    return <Fragment>
        <div className="form-group">
            <label htmlFor={name}>{label}</label>
            <select name={name} id={name} onChange={onChange} >
                {options.map(option => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    </Fragment>
}
