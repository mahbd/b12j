import axios from "axios";
import { createAction } from "@reduxjs/toolkit";
import { getJwt } from "../components/authService";
import { apiEndpoint } from "../configuration";

export const apiCallBegan = createAction("api/callBegan");
// export const apiCallSuccess = createAction("api/callSuccess")
export const apiCallFailed = createAction("api/callFailed");
axios.defaults.headers.common["x-auth-token"] = getJwt();

const api =
   ({ dispatch }) =>
   (next) =>
   async (action) => {
      if (action.type !== apiCallBegan.type) return next(action);
      const { url, method, data, onSuccess, onError, onStart, onFailed } = action.payload;
      if (onStart) {
         dispatch({ type: onStart });
      }
      next(action);
      try {
         const response = await axios.request({
            baseURL: apiEndpoint,
            url,
            method,
            data,
         });
         if (onSuccess) {
            dispatch({ type: onSuccess, payload: response.data });
         }
      } catch (error) {
         if (onFailed) dispatch({ type: onFailed });
         dispatch(apiCallFailed({ payload: error.message }));
         if (onError) dispatch({ type: onError, payload: error.message });
      }
   };
export default api;
