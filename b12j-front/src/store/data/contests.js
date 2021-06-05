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

    getList = (page=1) => {
        page = parseInt(page)
        this._loadSection(`/contests/?limit=20&offset=${(page - 1)*20}`, page);
        return this.list(this.store.getState().contests.list[page]);
    }
}