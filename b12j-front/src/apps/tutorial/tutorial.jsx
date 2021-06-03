import React, {useContext} from 'react';
import {FormattedHtml} from "../../common/objectViewFuncs";
import {Link} from "react-router-dom";
import {SuperContext} from "../../context";
import TutorialComments from "./comment/commentList";

const Tutorial = ({match}) => {
  const {tutorialActs} = useContext(SuperContext);
  const {tutorialId} = match.params;
  const tutorial = tutorialActs.getById(tutorialId);

  return (
    tutorial && <div className="container">
      <div className="row pt-2 pb-5">
        <div className="col"><Link to={"/tutorials"} className={"white-link"}>Back</Link></div>
        <h1 className={"col-auto h1 text-secondary rounded-3"}>{tutorial.title}</h1>
      </div>

      <div>
        {tutorial.notice && <div className="alert alert-info">{tutorial.notice}</div>}
        <FormattedHtml text={tutorial.text}/>
      </div>

      <br/><br/>
      <TutorialComments tutorialId={tutorial.id}/>
    </div>
  );
}

export default Tutorial;

