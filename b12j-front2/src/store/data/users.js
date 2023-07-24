import { createSlice } from "@reduxjs/toolkit";
import {createSelector} from "reselect";
import { getCurrentUser } from "../../components/authService";
import { basicActions, basicReducers, standardInitialState } from "../basicReducerTemplate";
import { serverUrls } from "../../configuration";

const name = "user";
const slice = createSlice({
   name: `${name}s`,
   initialState: {
      ...standardInitialState(),
      info: getCurrentUser(),
   },
   reducers: {
      ...basicReducers(name),

      loggedIn: (state, action) => {
         state.info = action.payload;
      },
      loggedOut: (state) => {
         state.info = null;
      },
   },
});
export default slice.reducer;

export class userActions extends basicActions {
   constructor(store, ws) {
      super(slice, store, ws, name);
   }

   loadUsers = () => {
      if (this.store.getState().users.loading) {
         return;
      }
      this._load(`${serverUrls.userList}/?limit=1000`);
   };

   getList = () => {
      const userList = createSelector(
        () => this.store.getState()[`${name}s`].list,
        users => this.list(users)
      )()
      if (userList.length === 0) this.loadUsers();
      return userList;
   };

   firstName = (id) => {
      return this.getById(id, "first_name");
   };

   fullName = (id) => {
      if (!this.getById(id, "first_name") && !this.getById(id, "last_name")) {
         return this.getById(id, "username");
      }
      return this.getById(id, "first_name") + " " + this.getById(id, "last_name");
   };

   currentUser = () => {
      return this.store.getState()[`${this.name}s`].info;
   };
}
