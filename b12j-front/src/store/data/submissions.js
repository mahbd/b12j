import {
    basicActions,
    basicReducers,
    receivedWithPagination,
    standardInitialState,
    updatedWithPagination
} from "../basicReducerTemplate";
import {createSlice} from "@reduxjs/toolkit";

const name = 'submission';

const slice = createSlice({
    name: `${name}s`,
    initialState: {
        ...standardInitialState(),
    },
    reducers: {
        ...basicReducers(name),
        submissionsReceived: (state, action) => {
            receivedWithPagination(state, action);
        },
        submissionUpdated: (state, action) => {
            updatedWithPagination(state, action);
        }
    }
})
export default slice.reducer;

export class submissionActions extends basicActions {
    constructor(store, ws) {
        super(slice, store, ws, name);
    }

    getList = (page = 1) => {
        page = parseInt(page);
        this._loadSection(`/submissions/?limit=20&offset=${(page - 1) * 20}`, page);
        return this.list(this.store.getState().submissions.list[page]);
    }

    submissionDetails = (id) => {
        const submission = this.getById(id);
        if (submission) {
            if (!submission.details) this._loadById(id);
            else return submission.details;
        }
        return null;
    }

    totalPages = () => {
        return this.store.getState()[this.name + 's'].total;
    }
}
