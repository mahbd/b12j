import React from "react";

export const renderInput = (formInfo, name, label, type="text") => {
   return (
      <div className="form-group">
         <label htmlFor={name}>{label}</label>
         <input type={type} {...formInfo.register(name)} className="form-control" />
         {formInfo.errors[name] && <div className="alert alert-danger">{formInfo.errors[name].message}</div>}
      </div>
   );
};

export const renderButton = (label, cls = "btn btn-primary", extra = {}) => {
   return (
      <button className={cls} type={"button"} {...extra}>
         {label}
      </button>
   );
}

export const renderSubmitButton = (label, cls = "btn btn-primary", errors, extra = {}) => {
   return (
      <button disabled={errors} className={cls} {...extra} type={"submit"}>
         {label}
      </button>
   );
}