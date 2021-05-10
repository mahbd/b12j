import jwtDecode from 'jwt-decode';
import httpService from "./httpService";
import {firebaseConfig, endpoint} from "../configuration";


export function logout(redirectURL = '/') {
  localStorage.removeItem("token");
  window.location = redirectURL
}

export const firebaseLoginImplement = () => {
  const firebaseui = window.firebaseui;
  const firebase = window.firebase;
  firebase.initializeApp(firebaseConfig);

  const ui = new firebaseui.auth.AuthUI(firebase.auth());
  const uiConfig = {
    callbacks: {
      signInSuccessWithAuthResult: async () => {
        const idToken = await firebase.auth().currentUser.getIdToken(true);
        try {
          const response = await httpService.post(endpoint + '/users/login/', {idToken});
          localStorage.setItem("token", response.data.jwt);
          window.location = "/";
          return true;
        } catch (e) {
          console.log(e);
          return false;
        }

      },
    },
    signInFlow: 'popup',
    // signInSuccessUrl: "/users/loginServe",
    signInOptions: [
      firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      firebase.auth.FacebookAuthProvider.PROVIDER_ID,
      firebase.auth.GithubAuthProvider.PROVIDER_ID,
    ],
  };
  ui.start('#firebaseui-auth-container', uiConfig);
}

export const loginWithPassword = async (username, password) => {
  httpService.post(endpoint + '/login/', {username, password}).then(
    response => {
      localStorage.setItem("token", response.data.jwt);
      window.location = '/'
    }
  ).catch(
    error => {
      alert(error.response.data.errors);
    }
  )
}

export function getCurrentUser() {
  try {
    const jwt = localStorage.getItem("token");
    return jwtDecode(jwt)
  } catch {
    return null;
  }
}

export function getJwt() {
  return localStorage.getItem("token")
}
