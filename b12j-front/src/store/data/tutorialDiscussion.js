import {
  basicActions,
  basicReducers, receivedDiscussions,
  standardInitialState,
  updatedWithPagination
} from "../basicReducerTemplate";
import {createSlice} from "@reduxjs/toolkit";

const name = 'tutorialDiscussion';

const slice = createSlice({
  name: `${name}s`,
  initialState: {
    ...standardInitialState()
  },
  reducers: {
    ...basicReducers(name),
    [`${name}sReceived`]: (state, action) => {
      receivedDiscussions(state, action, 'tutorial');
    },
    [`${name}Updated`]: (state, action) => {
      updatedWithPagination(state, action);
    }
  }
});
export default slice.reducer;

export class tutorialDiscussionActions extends basicActions {
  constructor(store, ws) {
    super(slice, store, ws, name);
  }

  getList = (tutorial = 1) => {
    tutorial = parseInt(tutorial)
    this._loadSection(`/tutorials/${tutorial}/comments/?limit=1000`, tutorial);
    return this.list(this.store.getState()[`${name}s`].list[tutorial]);
  }

  totalPages = () => {
    return this.store.getState()[`${name}s`].total;
  }
}
