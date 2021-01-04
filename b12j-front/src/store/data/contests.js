import {basicActions, basicReducers, receivedWithPagination, standardInitialState} from "../basicReducerTemplate";
import {createSlice} from "@reduxjs/toolkit";

const name = 'contest';

const slice = createSlice({
    name: `${name}s`,
    initialState: {
        ...standardInitialState()
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

    _loadContest = (page=1) => {
        const contests = this.store.getState().contests;
        if (contests.fetched.indexOf(page) !== -1 || contests.loading) return;
        if(page < 1 || (contests.total && page > contests.total)) {
            alert("Wrong page");
        }

        this._load(`/contests/?limit=20&offset=${(page - 1)*20}`)
    };

    getList = (page=1) => {
        this._loadContest(page);
        return this.list(this.store.getState().contests.list[page]);
    }
}