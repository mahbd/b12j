import jwtDecode from "jwt-decode";
import { apiEndpoint, keys, serverUrls, urls } from "../configuration";
import httpService from "./httpService";

export function logout(redirectURL = undefined) {
  localStorage.removeItem(keys.ACCESS);
  localStorage.removeItem(keys.REFRESH);
  if (redirectURL) window.location = redirectURL;
  else window.location.reload();
}

export function getJwt() {
  return localStorage.getItem(keys.ACCESS);
}

export function setJwt(jwt) {
  return localStorage.setItem(keys.ACCESS, jwt);
}

export function setRefreshToken(refreshToken) {
  return localStorage.setItem(keys.REFRESH, refreshToken);
}

export const loginWithPassword = async (username, password) => {
  httpService
    .post(`${apiEndpoint}${serverUrls.login}/`, { username, password })
    .then((response) => {
      localStorage.setItem(keys.ACCESS, response.data.access);
      localStorage.setItem(keys.REFRESH, response.data.refresh);
      window.location = "/";
    })
    .catch((error) => {
      alert(error.response.data.errors);
    });
};

export function getCurrentUser() {
  try {
    const jwt = localStorage.getItem(keys.ACCESS);
    return jwtDecode(jwt);
  } catch {
    return null;
  }
}

export function getRefreshToken() {
  return localStorage.getItem(keys.REFRESH);
}


export const refreshAccessToken = () => {
  httpService.post(`${apiEndpoint}${serverUrls.refreshToken}/`, { refresh: getRefreshToken() })
    .then(response => {
      localStorage.setItem(keys.ACCESS, response.data.access);
      window.location.reload();
    }).catch(error => {
      if (error.response && error.response.status === 401) {
        logout(urls.login);
      }
  });
};

export const verifyUpdateAccessToken = () => {
  httpService.post(`${apiEndpoint}${serverUrls.verifyToken}/`, { token: getJwt() })
    .catch(error => {
      if (error.response && error.response.status === 401) {
        refreshAccessToken();
      }
    });
};