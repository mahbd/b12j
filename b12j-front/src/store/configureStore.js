import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import reducer from "./reducer";
import api from "./api";

export default function storeFunc() {
   return configureStore({
      reducer,
      middleware: [...getDefaultMiddleware(), api],
   });
}
