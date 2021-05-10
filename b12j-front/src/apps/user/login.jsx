import React, {useContext, useEffect, useState} from 'react';
import {firebaseLoginImplement, loginWithPassword} from "../../common/authService";
import {SuperContext} from "../../context";

const Login = () => {
    const {userActs} = useContext(SuperContext);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    useEffect(() => {
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.async = true;
        script.innerText = firebaseLoginImplement();
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
                    <input type="text" value={username} name="username" placeholder="Email/Username"
                           onChange={handleInputChange}/>
                    <input type="password" value={password} name="password" placeholder="Password"
                           onChange={handleInputChange}/>
                    <div className="row" style={{width: "220px"}}>
                        <div className="col-4">
                            <button className="btn btn-success" onClick={() => loginWithPassword(username, password)}
                                    style={{width: "63px"}}>SignIn
                            </button>
                        </div>
                        <div className="col-8">
                            <a className="btn btn-primary" href={"/users/password_reset/"} style={{width: "145px"}}>Reset
                                Password</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
