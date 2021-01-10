import jwtDecode from 'jwt-decode';
import httpService from "./httpService";
import {apiEndpoint} from "../configuration";


export function logout(redirectURL = '/') {
    localStorage.removeItem("token");
    window.location = redirectURL
}

export const loginWithPassword = async (username, password) => {
    httpService.post(apiEndpoint + '/login/', {username, password}).then(
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
