import axios from 'axios'
import {getJwt} from "./authService";

axios.defaults.headers.common['x-auth-token'] = getJwt();

axios.interceptors.response.use(null, error => {
    const expectedError =
        error.response &&
        error.response.status >= 400 &&
        error.response.status < 500;

    if(!expectedError) {
        console.log("Logging the error", error);
        alert("An unexpected error.");
    }

    return Promise.reject(error);
});

// eslint-disable-next-line import/no-anonymous-default-export
export default {
    get: axios.get,
    post: axios.post,
    put: axios.put,
    delete: axios.delete
};