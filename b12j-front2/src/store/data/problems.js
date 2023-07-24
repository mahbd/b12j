import {
  basicActions,
  basicReducers,
  standardInitialState,
  receivedWithPagination,
  updatedWithPagination
} from "../basicReducerTemplate";
import { createSlice } from "@reduxjs/toolkit";
import { apiCallBegan } from "../api";
import { serverUrls } from "../../configuration";

const name = "problem";

const slice = createSlice({
  name: `${name}s`,
  initialState: {
    ...standardInitialState(),
    fetchedContests: {},
    contestList: {},
  },
  reducers: {
    ...basicReducers(name),
    [`${name}sReceived`]: (state, action) => {
      receivedWithPagination(state, action);
    },
    [`${name}Updated`]: (state, action) => {
      updatedWithPagination(state, action);
    },
    contestProblemsReceived: (state, action) => {
      state.loading = false;
      const contestId = parseInt(action.payload.id);
      state.fetchedContests[contestId] = Date.now();
      state.contestList[contestId] = [];
      state.dict[contestId] = {};
      const { results } = action.payload;
      if (!results) {
        alert("Bug detected in API. Please contact admin.")
        return;
      }
      for (let result of results) {
        state.dict[result.problem.id] = { ...result.problem, sid: result.problem_char, contestId: result.contest };
        state.contestList[contestId].push(result.problem.id);
      }
    }
  }
});
export default slice.reducer;

export class problemActions extends basicActions {
  constructor(store, ws) {
    super(slice, store, ws, name);
    this.contestProblemsReceived = slice.actions["contestProblemsReceived"];
    this.pendingContests = {};
  }

  getAllList = () => {
    let fullList = [];
    for (let i = 1; i <= (this.totalPages() || 1); i++) {
      fullList = [...fullList, ...this.getListPage(i)];
    }
    return fullList;
  };

  _loadContestProblems = (contestId) => {
    const url = `${serverUrls.contests}/${contestId}/problems/`;
    if (this.store.getState()[`${this.name}s`].fetchedContests[contestId] || this.pendingContests[contestId]) return;
    this.pendingContests[contestId] = Date.now();
    this.store.dispatch(
      apiCallBegan({
        url: url,
        onStart: this.requested.type,
        onSuccess: this.contestProblemsReceived.type,
        onFailed: this.requestFailed.type
      })
    );
  };

  contestProblems = (contestId = 1) => {
    contestId = parseInt(contestId);
    this._loadContestProblems(contestId);
    return this.list(this.store.getState()[`${name}s`].contestList[contestId]);
  };

  totalPages = () => {
    return this.store.getState()[`${name}s`].total;
  };
}
