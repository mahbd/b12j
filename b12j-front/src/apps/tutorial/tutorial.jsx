import React, {useState, useContext, useEffect} from 'react';
import {SuperContext} from "../../app";
import {FormattedHtml} from "../../common/objectViewFuncs";

const Tutorial = ({match}) => {
    const {tutorialActs, userActs} = useContext(SuperContext);
    const {tutorialId} = match.params;
    const [tutorial, setTutorial] = useState(tutorialActs.getById(tutorialId));
    const [reload, setReload] = useState(false);

    tutorialActs.store.subscribe(() => {
        setTutorial(tutorialActs.getById(tutorialId));
        setReload(!reload);
    });

    useEffect(() => {
        setTutorial(tutorialActs.getById(tutorialId));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tutorialId]);

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
            {!tutorial && <h1>Loading</h1>}
        </div>
    );
};

export default Tutorial;