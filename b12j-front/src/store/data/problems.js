import {
    basicActions,
    basicReducers,
    standardInitialState,
    receivedWithPagination,
    updatedWithPagination
} from "../basicReducerTemplate";
import {createSlice} from "@reduxjs/toolkit";

const name = 'problem';

const slice = createSlice({
    name: `${name}s`,
    initialState: {
        ...standardInitialState()
    },
    reducers: {
        ...basicReducers(name),
        [`${name}sReceived`]: (state, action) => {
            receivedWithPagination(state, action);
        },
        [`${name}problemUpdated`]: (state, action) => {
            updatedWithPagination(state, action);
        }
    }
});
export default slice.reducer;

export class problemActions extends basicActions {
    constructor(store, ws) {
        super(slice, store, ws, name);
    }

    _loadProblems = (page) => {
        const problems = this.store.getState().problems;
        if (problems.fetched.indexOf(page) !== -1 || problems.loading) return;
        if (page < 1 || (problems.total && page > problems.total)) {
            alert("Wrong page");
            return;
        }
        this._load(`/problems/?limit=20&offset=${(page - 1) * 20}`);
    };

    getList = (page=1) => {
        this._loadProblems(page);
        return this.list(this.store.getState().problems.list[page]);
    }

    totalPages = () => {
        return this.store.getState()[this.name + 's'].total;
    }
}
