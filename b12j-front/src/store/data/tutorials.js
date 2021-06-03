import {
    basicActions,
    basicReducers,
    receivedWithPagination,
    standardInitialState,
    updatedWithPagination
} from "../basicReducerTemplate";
import {createSlice} from "@reduxjs/toolkit";

const name = 'tutorial';

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

export class tutorialActions extends basicActions {
    constructor(store, ws) {
        super(slice, store, ws, name);
    }

    _loadTutorials = (page) => {
        const tutorials = this.store.getState().tutorials;
        if (tutorials.fetched.indexOf(parseInt(page)) !== -1 || tutorials.loading) return;
        if (page < 1 || (tutorials.total && page > tutorials.total)) {
            alert("Wrong page");
            return;
        }
        this._load(`/tutorials/?limit=20&offset=${(page - 1) * 20}`);
    };

    getList = (page=1) => {
        this._loadTutorials(page);
        return this.list(this.store.getState().tutorials.list[page]);
    }

    totalPages = () => {
        return this.store.getState()[this.name + 's'].total;
    }
}
