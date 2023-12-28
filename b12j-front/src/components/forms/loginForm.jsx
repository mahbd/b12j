import React from "react";
import { apiEndpoint, endpoint, serverUrls, urls } from "../../configuration";
import httpService from "../httpService";
import { setJwt, setRefreshToken } from "../authService";
import { startLoading } from "../loadingAnimation";
import { Link } from "react-router-dom";
import { signInWithGoogle } from "../../apps/user/firebase";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { renderButton, renderInput, renderSubmitButton } from "./baseFormHelpers";

const schema = z.object({
   username: z.string().min(3).max(32),
   password: z.string().min(4).max(32)
});


const LoginWithGoogleButton = () => {
   return (
      <button type="button" className="btn btn-info form-btn" onClick={signInWithGoogle}>
         <img style={{ height: "90%" }} src="https://img.icons8.com/color/16/000000/google-logo.png"
              alt="google" /> Login with Google
      </button>
   );
};
//
const LoginForm = () => {
   const {
      register,
      handleSubmit,
      setError,
      getValues,
      formState: { errors }
   } = useForm({
      resolver: zodResolver(schema)
   });
   const formInfo = {
      errors,
      register,
      getValues
   };

   const onSubmit = async (data) => {
      try {
         startLoading("Checking username and password");
         const res = await httpService.post(`${apiEndpoint}${serverUrls.login}/`, data);
         const { access, refresh } = res.data;
         setJwt(access);
         setRefreshToken(refresh);
         // @ts-ignore
         window.location = urls.profile;
      } catch (ex) {
         if (ex.response && (ex.response.status === 400 || ex.response.status === 401)) {
            setError("username", {
               message: "No active account found with the given credentials"
            });
         }
      }
   };

   const toggleLoginWithEmail = () => {
      document.getElementById("login-form").classList.toggle("d-none");
      document.getElementById("login-form-button").classList.toggle("d-none");
   };

   return (
      <div className="container">
         <form className={"one-form"} onSubmit={handleSubmit(onSubmit)} method="post">
            <div className={"blank20"} />
            <LoginWithGoogleButton />
            <p className={"text-center pt-2 pb-2"}>or</p>
            <div id={"login-form"} className={"d-none"}>
               {renderInput(formInfo, "username", "Username")}
               {renderInput(formInfo, "password", "Password", "password")}
               {renderSubmitButton("Login", "btn btn-success form-btn")}
            </div>
            <div id={"login-form-button"}>
               {renderButton("Login with email", "btn btn-primary form-btn",
                  { onClick: toggleLoginWithEmail })}
            </div>
            <p>New user <Link to={urls.register} className="text-success">register</Link></p>
            <a href={`${endpoint}/accounts/password_reset/`} className="text-danger">Forgot password?</a>
         </form>
      </div>
   );
};

export default LoginForm;