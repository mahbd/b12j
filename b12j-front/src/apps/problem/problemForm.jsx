import React, {useContext, useState} from 'react';
import TextEditor from "../../common/fields/TextEditor";
import Input from "../../common/fields/input";
import CodeEditor from "../../common/fields/codeEditor";
import {SuperContext} from "../../context";

const ProblemForm = ({match, history}) => {
    const {contestId, problemId} = match.params;
    const {problemActs, contestActs} = useContext(SuperContext);
    const [problem] = useState(problemActs.getById(problemId));
    const [contest] = useState(contestActs.getById(contestId));

    let data = {}
    if (problem) {
        data = {...problem}
    } else {
        data = {
            contest_id: contestId,
            inTerms: 'input Terms',
            outTerms: 'output Terms',
            text: 'statement',
            title: 'problem title',
            corCode: '',
            conProbId: 'A',
            notice: 'nothing',
            time_limit: 1,
            examples: 1
        }
    }


    const setText = ({currentTarget}) => {
        const {name, value} = currentTarget;
        data[name] = value
    }

    const submit = () => {
        if(problem) {
            problemActs.edit(data);
            history.push(`/problems/${problem.id}`);
        } else {
            problemActs.add(data);
            history.push('/users/profile')
        }
    }

    return (
        <div className="container pt-5">
            {contest && <h1 className="text-info">{contest.title}</h1>}
            <Input label="Problem name" name="title" value={data['title']} onChange={setText}/>
            <TextEditor label="Problem Statement" name="text" value={data['text']} onChange={setText}/>
            <TextEditor label="Input Terms" name="inTerms" value={data['inTerms']} onChange={setText}/>
            <TextEditor label="Output Terms" name="outTerms" value={data['outTerms']} onChange={setText}/>
            <Input label="Problem id" placeholder='A' name="conProbId" value={data['conProbId']} onChange={setText}/>
            <CodeEditor mode="c_cpp" value={data['corCode']} theme="chrome" onChange={setText}
                        name="corCode" font={20} />
            <div className="bg-light">
                <h3 className="text-info">Everything below are optional. You don't need to change.</h3>
                <TextEditor label="Notice" name="notice" value={data['notice']} onChange={setText}/>
                <Input label="Time Limit" name="time_limit" value={data['time_limit']} type="number"
                       onChange={setText}/>
                <Input label="Number of example" name="examples" value={data['examples']} type="number"
                       onChange={setText}/>
            </div>
            <button className="btn-lg btn-success" onClick={submit}>Submit</button>
            <br/><br/><br/>
        </div>
    );
};

export default ProblemForm;