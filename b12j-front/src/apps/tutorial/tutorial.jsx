import React, {useContext} from 'react';
import {FormattedHtml} from "../../common/objectViewFuncs";
import {SuperContext} from "../../context";

const Tutorial = ({match}) => {
    const {tutorialActs, userActs} = useContext(SuperContext);
    const {tutorialId} = match.params;
    const tutorial = tutorialActs.getById(tutorialId);

    return (
        <div>
            {tutorial && <div className="container">
                <div className="bgDarkBlue">
                    <h1>{tutorial.title}</h1>
                    <h3>By {userActs.fullName(tutorial.by)}</h3>
                </div>
                <div className="bgAliceBlue">
                    <FormattedHtml text={tutorial.text}/>
                </div>
            </div>}
        </div>
    );
};

export default Tutorial;