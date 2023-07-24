import React from "react";
import BaseForm from "./baseForms";
import Joi from "joi";
import {apiEndpoint, endpoint, serverUrls, urls} from "../../configuration";
import httpService from "../httpService";
import {setJwt, setRefreshToken} from "../authService";
import {startLoading} from "../loadingAnimation";
import {Link} from "react-router-dom";
import {signInWithGoogle} from "../../apps/user/firebase";

class LoginForm extends BaseForm {
    state = {
        data: {},
        errors: {}
    };
    schema = {
        username: Joi.string().required().min(3).max(32).alphanum().label("Username"),
        password: Joi.string().required().min(4).max(32)
    };

    doSubmit = async () => {
        try {
            startLoading("Checking username and password");
            const res = await httpService.post(`${apiEndpoint}${serverUrls.login}/`, {...this.state.data});
            const {access, refresh} = res.data;
            setJwt(access);
            setRefreshToken(refresh);
            window.location = urls.profile
        } catch (ex) {
            if (ex.response && (ex.response.status === 400 || ex.response.status === 401)) {
                const errors = {...this.state.errors, username: "No active account found with the given credentials"};
                this.setState({errors});
            }
        }
    };

    toggleLoginWithEmail = () => {
        document.getElementById("login-form").classList.toggle("d-none");
        document.getElementById("login-form-button").classList.toggle("d-none");
    }

    render() {
        return (
            <div className="container">
                <form className={"one-form"} onSubmit={this.handleSubmit} method="post">
                    <div className={"blank20"}/>
                    <LoginWithGoogleButton/>
                    <p className={"text-center pt-2 pb-2"}>or</p>
                    <div id={"login-form"} className={"d-none"}>
                        {this.renderInput("username", "Username")}
                        {this.renderInput("password", "Password", "password")}
                        {this.renderSubmitButton("Login", "btn btn-success form-btn")}
                    </div>
                    <div id={"login-form-button"}>
                        {this.renderButton("Login with email", "btn btn-primary form-btn",
                            {onClick: this.toggleLoginWithEmail})}
                    </div>
                    <p>New user <Link to={urls.register} className="text-success">register</Link></p>
                    <a href={`${endpoint}/accounts/password_reset/`} className="text-danger">Forgot password?</a>
                </form>
            </div>
        );
    }
}

export default LoginForm;


const LoginWithGoogleButton = () => {
    return (
        <button type="button" className="btn btn-info form-btn" onClick={signInWithGoogle}>
            <img style={{height: "90%"}} src="https://img.icons8.com/color/16/000000/google-logo.png"
                 alt="google"/> Login with Google
        </button>
    );
}