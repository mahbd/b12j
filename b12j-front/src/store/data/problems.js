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
        [`${name}Updated`]: (state, action) => {
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
        const problems = this.store.getState()[`${name}s`];
        if (problems.fetched.indexOf(parseInt(page)) !== -1 || this.pending[parseInt(page)]) return;
        if (page < 1 || (problems.total && page > problems.total)) {
            alert("Wrong page");
            return;
        }
        this.pending[parseInt(page)] = Date.now();
        this._load(`/problems/?limit=20&offset=${(page - 1) * 20}`);
    };

    getList = (page=1) => {
        this._loadProblems(page);
        return this.list(this.store.getState()[`${name}s`].list[page]);
    }

    totalPages = () => {
        return this.store.getState()[`${name}s`].total;
    }
}
