import React, {useContext, useEffect, useState} from 'react';
import {SuperContext} from "../../app";
import {apiEndpoint} from "../../configuration";
import {loginWithPassword} from "../../common/authService";

const Login = () => {
    const {userActs} = useContext(SuperContext);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
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
                            body: JSON.stringify({"idToken": idToken})
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
            ],
        };
        ui.start('#firebaseui-auth-container', uiConfig);`
        document.body.appendChild(script);
        return () => {
            document.body.removeChild(script);
        }
    }, []);

    const handleInputChange = ({currentTarget}) => {
        if (currentTarget.name === 'username') setUsername(currentTarget.value);
        if (currentTarget.name === 'password') setPassword(currentTarget.value);
    }

    return (
        <div>
            <div onClick={userActs.start}>
                <div id="firebaseui-auth-container" className="pt-5"/>
            </div>
            <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                <button className="btn btn-danger" type="button" data-toggle="collapse" data-target="#collapseExample"
                        aria-expanded="false" aria-controls="collapseExample" style={{width: "220px"}}>
                    Password Login
                </button>
            </div>
            <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                <div className="collapse" id="collapseExample" style={{width: "220px"}}>
                    <input type="text" value={username} name="username" onChange={handleInputChange}/>
                    <input type="password" value={password} name="password" onChange={handleInputChange}/>
                    <button className="btn btn-success" onClick={() => loginWithPassword(username, password)}>Sign In
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Login;
