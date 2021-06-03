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

  _loadTutorialDiscussions = (tutorial) => {
    tutorial = parseInt(tutorial);
    const tutorialDiscussions = this.store.getState()[`${name}s`];
    if (tutorialDiscussions.fetched.indexOf(tutorial) !== -1 || this.pending[tutorial]) return;
    if (tutorial < 1) {
      alert("Wrong page");
      return;
    }
    this.pending[tutorial] = Date.now();
    this._load(`/tutorials/${tutorial}/comments/?limit=1000`);
  };

  getList = (page = 1) => {
    this._loadTutorialDiscussions(page);
    return this.list(this.store.getState()[`${name}s`].list[page]);
  }

  totalPages = () => {
    return this.store.getState()[`${name}s`].total;
  }
}
