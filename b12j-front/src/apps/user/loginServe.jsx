import React from 'react';
import {apiEndpoint} from "../../configuration";
import httpService from "../../common/httpService";
import Modal from "react-modal";

const LoginServe = () => {
    const communicateWithServer = async () => {
        const firebase = window.firebase;
        const idToken = await firebase.auth().currentUser.getIdToken(true);
        const response = await httpService.post(apiEndpoint + '/login/', {idToken});
        localStorage.setItem("token", response.data.jwt);
        window.location = "/";
    }
    communicateWithServer();


    return (
        <div>
            <h3>Checking credentials</h3>
            <Modal isOpen={true} className="Modal">
                <div className="loader align-middle"/>
            </Modal>
        </div>
    );
};

export default LoginServe;