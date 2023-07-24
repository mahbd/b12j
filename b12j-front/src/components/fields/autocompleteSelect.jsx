import React from "react";
import ReactSelect from "react-select";

export const AutocompleteSelect = ({ name, label, options, onChange, value, error, isMulti, ...rest }) => {

   const handleChange = (input) => {
      let value;
      if (isMulti) {
         value = [];
         for (let i = 0; i < input.length; i++) {
            value.push(input[i].value);
         }
      } else {
         value = input.value;
      }
      onChange({ currentTarget: { value, name } });
   };

   const convertValue = () => {
      let df = false;
      if (isMulti && value) {
         df = [];
         for (let x of value) {
            for (let y of options) {
               if (y.value === x) {
                  df.push(y);
                  break;
               }
            }
         }
      } else if (!isMulti && value) {
         for (let x of options) {
            if (x.value === value) {
               df = x;
               break;
            }
         }
      }
      return df;
   };

   return (
      <div>
         <label htmlFor={name}>{label}</label>
         <ReactSelect
            value={convertValue()}
            isMulti={isMulti}
            name={name}
            label={label}
            options={options}
            onChange={handleChange}
            {...rest}
         />
         {error && <div className="alert-danger">{error}</div>}
      </div>
   );
};

export default AutocompleteSelect