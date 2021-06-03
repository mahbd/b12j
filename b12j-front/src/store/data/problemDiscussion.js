import {
  basicActions,
  basicReducers, receivedDiscussions,
  standardInitialState,
  updatedWithPagination
} from "../basicReducerTemplate";
import {createSlice} from "@reduxjs/toolkit";

const name = 'problemDiscussion';


const slice = createSlice({
  name: `${name}s`,
  initialState: {
    ...standardInitialState()
  },
  reducers: {
    ...basicReducers(name),
    [`${name}sReceived`]: (state, action) => {
      receivedDiscussions(state, action, 'problem');
    },
    [`${name}Updated`]: (state, action) => {
      updatedWithPagination(state, action);
    }
  }
});
export default slice.reducer;

export class problemDiscussionActions extends basicActions {
  constructor(store, ws) {
    super(slice, store, ws, name);
  }

  _loadProblemDiscussions = (problem) => {
    const problemDiscussions = this.store.getState()[`${name}s`];
    if (problemDiscussions.fetched.indexOf(parseInt(problem)) !== -1 || this.pending[parseInt(problem)]) return;
    if (problem < 1) {
      alert("Wrong page");
      return;
    }
    this.pending[parseInt(problem)] = Date.now();
    this._load(`/problems/${problem}/comments/?limit=1000`);
  };

  getList = (page = 1) => {
    this._loadProblemDiscussions(page);
    return this.list(this.store.getState()[`${name}s`].list[page]);
  }

  totalPages = () => {
    return this.store.getState()[`${name}s`].total;
  }
}
