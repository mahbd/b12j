import axios from "axios";
import { keys } from "../configuration";
import { startLoading, stopLoading } from "./loadingAnimation";

export function getJwt() {
  return localStorage.getItem(keys.ACCESS);
}
if (getJwt()) {
   axios.defaults.headers.common["authorization"] = "Bearer " + getJwt();
}

axios.interceptors.response.use(res => {
   stopLoading();
   return res;
}, (error) => {
   const expectedError = error.response && error.response.status >= 400 && error.response.status < 500;

   if (!expectedError) {
      console.log("Logging the error", error);
      alert("An unexpected error.");
   }
   stopLoading();
   return Promise.reject(error);
});

axios.interceptors.request.use((config) => {
  startLoading();
  return config;
});

// eslint-disable-next-line import/no-anonymous-default-export
export default {
   get: axios.get,
   post: axios.post,
   put: axios.put,
   patch: axios.patch,
   delete: axios.delete,
};
