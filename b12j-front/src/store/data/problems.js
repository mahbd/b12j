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

    getList = (page=1) => {
        page = parseInt(page);
        this._loadSection(`/problems/?limit=20&offset=${(page - 1) * 20}`, page);
        return this.list(this.store.getState()[`${name}s`].list[page]);
    }

    totalPages = () => {
        return this.store.getState()[`${name}s`].total;
    }
}
