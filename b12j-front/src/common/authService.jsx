import jwtDecode from 'jwt-decode';

export function logout(redirectURL='/') {
    localStorage.removeItem("token");
    window.location = redirectURL
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
