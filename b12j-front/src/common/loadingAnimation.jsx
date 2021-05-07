import React, {useContext, useEffect} from 'react';
import Modal from "react-modal";
import {SuperContext} from "../context";


const LoadingAnimation = () => {
    const {userActs} = useContext(SuperContext);
    const state = userActs.store.getState();

    useEffect(() => {
        Modal.setAppElement('body');
    }, []);

    const isLoading = state.problems.loading || state.users.loading ||
      state.contests.loading || state.submissions.loading;

    return <Modal isOpen={isLoading} className="Modal">
        <div className="loader align-middle"/>
    </Modal>
}

export default LoadingAnimation;
