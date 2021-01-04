import React, {useContext, useEffect, useState} from 'react';
import Modal from "react-modal";
import {SuperContext} from "../app";

const LoadingAnimation = () => {
    const {userActs} = useContext(SuperContext);
    const store = userActs.store;
    const [problem, setProblem] = useState(!!store.getState().problems.loading)
    const [user, setUser] = useState(!!store.getState().users.loading)
    const [contest, setContest] = useState(!!store.getState().contests.loading)
    const [submission, setSubmission] = useState(!!store.getState().submissions.loading)


    store.subscribe(() => {
        setProblem(!!store.getState().problems.loading);
        setUser(!!store.getState().users.loading);
        setContest(!!store.getState().contests.loading);
        setSubmission(!!store.getState().submissions.loading);
    });

    useEffect(() => {
        Modal.setAppElement('body');
    }, []);

    const isLoading = problem || user || contest || submission;

    return <Modal isOpen={isLoading} className="Modal">
        <div className="loader align-middle"/>
    </Modal>
}

export default LoadingAnimation;
