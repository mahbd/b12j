import React, {useEffect, useContext} from 'react';
import {SuperContext} from "../../app";
import {apiEndpoint} from "../../configuration";

const Login = () => {
    const {userActs} = useContext(SuperContext);
    useEffect(() => {
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.async = true;
        script.innerText = `const firebaseConfig = {
            apiKey: "AIzaSyB9n-TJY1hy49WoECQH7fZXlxA7lKI2VH4",
            authDomain: "b12j-mah.firebaseapp.com",
            databaseURL: "https://b12j-mah.firebaseio.com",
            projectId: "b12j-mah",
            storageBucket: "b12j-mah.appspot.com",
            messagingSenderId: "704405925886",
            appId: "1:704405925886:web:2066da3c25584a7ed4daaf",
            measurementId: "G-XE9M4QRX4J"
        };
        firebase.initializeApp(firebaseConfig);
    
        const ui = new firebaseui.auth.AuthUI(firebase.auth());
        const uiConfig = {
            callbacks: {
                signInSuccessWithAuthResult: function (authResult, redirectUrl) {
                    firebase.auth().currentUser.getIdToken(/* forceRefresh */ true).then(function (idToken) {
                        fetch('${apiEndpoint + "/login/"}', {
                            method: "POST",
                            headers: {'token': idToken}
                        }).then(async (response) => {
                            const data = await response.json();
                            localStorage.setItem("token", data.jwt);
                            window.location = '/';                        
                        })
                    });
                    return true;
                },
            },
            signInFlow: 'popup',
            signInOptions: [
                firebase.auth.GoogleAuthProvider.PROVIDER_ID,
                firebase.auth.FacebookAuthProvider.PROVIDER_ID,
                firebase.auth.GithubAuthProvider.PROVIDER_ID,
                firebase.auth.TwitterAuthProvider.PROVIDER_ID,
                firebase.auth.EmailAuthProvider.PROVIDER_ID,
            ],
        };
        ui.start('#firebaseui-auth-container', uiConfig);`
        document.body.appendChild(script);
        return () => {
            document.body.removeChild(script);
        }
    }, []);
    return (
        <div>
            <div onClick={userActs.start}><div id="firebaseui-auth-container" className="pt-5" /></div>
        </div>
    );
};

export default Login;
