import { basicActions, basicReducers, receivedWithPagination, standardInitialState } from "../basicReducerTemplate";
import { createSlice } from "@reduxjs/toolkit";

const name = "contest";

const slice = createSlice({
   name: `${name}s`,
   initialState: {
      ...standardInitialState(),
   },
   reducers: {
      ...basicReducers(name),
      contestsReceived: (state, action) => {
         receivedWithPagination(state, action);
      },
   },
});

export default slice.reducer;

export class contestActions extends basicActions {
   constructor(store, ws) {
      super(slice, store, ws, name);
   }

   getAllList = () => {
      let fullList = [];
      for (let i = 1; i <= this.totalPages(); i++) {
         fullList = [...fullList, ...this.getListPage(i)];
      }
      return fullList;
   };

   totalPages = () => {
      return this.store.getState()[this.name + "s"].total | 1;
   };
}
