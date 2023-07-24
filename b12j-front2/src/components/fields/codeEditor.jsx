import React from "react";
import AceEditor from "react-ace";

import "ace-builds/src-min-noconflict/mode-c_cpp.js";
import "ace-builds/src-min-noconflict/mode-python.js";
import "ace-builds/src-min-noconflict/theme-gob.js";
import "ace-builds/src-min-noconflict/theme-chrome.js";
import "ace-builds/src-min-noconflict/ext-language_tools.js";
import "ace-builds/src-min-noconflict/snippets/c_cpp.js";
import "ace-builds/src-min-noconflict/snippets/python.js";

const CodeEditor = ({ name, label, onChange, error, ...rest }) => {
  const onChangeCode = (newValue) => {
    onChange({ currentTarget: { name, value: newValue } });
  };
  return (
    <React.Fragment>
      <label htmlFor={name}>{label}</label>
      <AceEditor {...rest}
        onChange={onChangeCode}
        name={name}
        width={"100%"}
        enableBasicAutocompletion={true}
        enableLiveAutocompletion={true}
        enableSnippets={true}
        setOptions={{
          useWorker: false
        }}
      />
      {error && <div className={"alert-danger"}>{error}</div>}
    </React.Fragment>
  );
};

export default CodeEditor