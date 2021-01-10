import React, {useContext, useEffect, useState} from 'react';
import {SuperContext} from "../../app";
import {firebaseLoginImplement, loginWithPassword} from "../../common/authService";

const Login = ({history}) => {
    const {userActs} = useContext(SuperContext);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    useEffect(() => {
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.async = true;
        script.innerText = firebaseLoginImplement(history);
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
