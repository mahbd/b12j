import {
   basicActions,
   basicReducers,
   receivedDiscussions,
   standardInitialState,
   updatedWithPagination,
} from "../basicReducerTemplate";
import { createSlice } from "@reduxjs/toolkit";

const name = "problemDiscussion";

const slice = createSlice({
   name: `${name}s`,
   initialState: {
      ...standardInitialState(),
   },
   reducers: {
      ...basicReducers(name),
      [`${name}sReceived`]: (state, action) => {
         receivedDiscussions(state, action, "problem");
      },
      [`${name}Updated`]: (state, action) => {
         updatedWithPagination(state, action);
      },
   },
});
export default slice.reducer;

export class problemDiscussionActions extends basicActions {
   constructor(store, ws) {
      super(slice, store, ws, name);
   }

   getList = (problem = 1) => {
      problem = parseInt(problem);
      this._loadSection(`/problems/${problem}/comments/?limit=1000`, problem);
      return this.list(this.store.getState()[`${name}s`].list[problem]);
   };

   totalPages = () => {
      return this.store.getState()[`${name}s`].total;
   };
}
