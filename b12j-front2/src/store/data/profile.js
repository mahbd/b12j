import {
   basicActions,
   basicReducers,
   standardInitialState,
   receivedWithPagination,
   updatedWithPagination,
} from "../basicReducerTemplate";
import { createSlice } from "@reduxjs/toolkit";

const name = "profile";

const slice = createSlice({
   name: `${name}s`,
   initialState: {
      ...standardInitialState(),
   },
   reducers: {
      ...basicReducers(name),
      [`${name}sReceived`]: (state, action) => {
         console.log(action.payload);
      },
   },
});
export default slice.reducer;

export class profileActions extends basicActions {
   constructor(store, ws) {
      super(slice, store, ws, name);
   }

   getList = (content_name) => {
      this._load(`/${content_name}/?limit=1000`);
      return this.list(this.store.getState()[`${name}s`].list[content_name]);
   };

   totalPages = () => {
      return this.store.getState()[`${name}s`].total;
   };
}
