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

    _loadSubmission = (page = 1) => {
        const submissions = this.store.getState().submissions;
        if (submissions.fetched.indexOf(page) !== -1 || submissions.loading) return;
        if (page < 1 || (submissions.total && page > submissions.total)) {
            alert("Wrong page");
            return;
        }
        this._load(`/submissions/?limit=20&offset=${(page - 1) * 20}`)
    };

    getList = (page = 1) => {
        this._loadSubmission(page);
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
