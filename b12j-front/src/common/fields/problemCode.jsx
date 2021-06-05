import React, {useContext, useState} from 'react';
import {useHistory} from "react-router-dom";
import httpService from "../httpService";
import {getCurrentUser} from "../authService";
import {apiEndpoint} from "../../configuration";
import {SuperContext} from "../../context";
import AceEditor from "react-ace";

import "ace-builds/src-noconflict/mode-python"
import "ace-builds/src-noconflict/mode-c_cpp"
import "ace-builds/src-noconflict/theme-chrome"
import "ace-builds/src-noconflict/theme-gob"
import "ace-builds/src-noconflict/ext-language_tools"
import "ace-builds/src-noconflict/snippets/c_cpp"
import "ace-builds/src-noconflict/snippets/python"

const ProblemCode = ({problem}) => {
  const history = useHistory();
  const {submissionActs} = useContext(SuperContext)
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('python');
  const [theme, setTheme] = useState('chrome');
  const [font, setFont] = useState(15);

  const user = getCurrentUser();

  function onChangeCode(newValue) {
    setCode(newValue);
  }

  const handleChange = ({currentTarget}) => {
    const {name, value} = currentTarget;
    if (name === 'language') {
      if (value === "c_cpp" && code === '') {
        setCode("#include<bits/stdc++.h>\n#define ll long long\nusing namespace std;\nint main() {\n\t\n}")
      }
      setLanguage(value);
    } else if (name === problem.id) setCode(value);
    else if (name === 'theme') setTheme(value);
    else if (name === 'font') setFont(value);
  };


  const submit = async () => {
    if (code.length < 10) {
      alert("Your code is less than 10 character. If you're pasting code then please press space or any key after paste.");
      return;
    }
    if (language !== 'python' && language !== 'c_cpp') {
      alert("Please choose correct language");
      return;
    }
    const data = {
      code, language, problem: problem.id
    }
    submissionActs.start();
    try {
      const response = await httpService.post(apiEndpoint + '/submissions/', data)
      submissionActs.failure();
      history.push(`/submissions/${response.data.id}`)
    } catch (error) {
      submissionActs.failure();
      if (error.response && error.response.status === 403) {
        window.location.reload();
      } else if (error.response) {
        console.log("This is the error reason. Please send it to Mahmudul", error.response);
        alert(`Tell this to Mahmudul: code: ${error.response.status}`);
      } else {
        console.log(error);
        alert("Couldn't submit. Sometimes server is causing this error. Check your console");
      }
    }
  }

  return (
    <div id={"codeEditor"}>
      <div className="row pr-3 pl-3">
        <select className="custom-select col-4" name="language" onChange={handleChange}>
          <option value="python">Python3</option>
          <option value="c_cpp">C/C++</option>
        </select>
        <select className="custom-select col-4" name="theme" id="theme" onChange={handleChange}>
          <option value="chrome">White</option>
          <option value="gob">Dark</option>
        </select>
        <select className="custom-select col-4" name="font" id="font" onChange={handleChange}>
          <option value="15px">15px</option>
          <option value="12px">12px</option>
          <option value="18px">18px</option>
          <option value="20px">20px</option>
        </select>
      </div>
      <AceEditor mode={language} value={code} theme={theme} onChange={onChangeCode} name={problem.id.toString()}
                 fontSize={font} width={"100%"} enableBasicAutocompletion={true} enableLiveAutocompletion={true}
                 enableSnippets={true} setOptions={{
        useWorker: false,
      }}/>
      {!user && <div className="alert alert-danger">Please login to submit</div>}
      <button disabled={!user} className="btn btn-success" onClick={submit}>Submit</button>
    </div>
  );
};

export default ProblemCode;