import {
   basicActions,
   basicReducers,
   receivedWithPagination,
   standardInitialState,
   updatedWithPagination,
} from "../basicReducerTemplate";
import { createSlice } from "@reduxjs/toolkit";

const name = "tutorial";

const slice = createSlice({
   name: `${name}s`,
   initialState: {
      ...standardInitialState(),
   },
   reducers: {
      ...basicReducers(name),
      [`${name}sReceived`]: (state, action) => {
         receivedWithPagination(state, action);
      },
      [`${name}problemUpdated`]: (state, action) => {
         updatedWithPagination(state, action);
      },
   },
});

export default slice.reducer;

export class tutorialActions extends basicActions {
   constructor(store, ws) {
      super(slice, store, ws, name);
   }

   getList = (page = 1) => {
      page = parseInt(page);
      this._loadSection(`/tutorials/?limit=20&offset=${(page - 1) * 20}`, page);
      return this.list(this.store.getState().tutorials.list[page]);
   };

   totalPages = () => {
      return this.store.getState()[this.name + "s"].total;
   };
}
