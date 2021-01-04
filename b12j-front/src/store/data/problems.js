import {basicActions, basicReducers, standardInitialState} from "../basicReducerTemplate";
import {createSlice} from "@reduxjs/toolkit";

const name = 'problem';

const slice = createSlice({
    name: `${name}s`,
    initialState: {
        ...standardInitialState()
    },
    reducers: {
        ...basicReducers(name),
        problemsReceived: (state, action) => {
            const data = action.payload.results;
            if (data.length < 1) console.log("No Problems for this contest");
            else {
                let contestId = data[0].contest;
                state.loading = false;
                state.fetched.push(contestId)
                for (let i = 0; i < data.length; i++) {
                    state.dict[data[i].id] = data[i];
                }
            }

        },
    }
});
export default slice.reducer;

export class problemActions extends basicActions {
    constructor(store, ws) {
        super(slice, store, ws, name);
    }

    _loadProblems = (contestId) => {
        const problems = this.store.getState().problems;
        if(problems.fetched.indexOf(contestId) !== -1 || problems.loading) return ;
        this._load(`/problems/?contest_id=${contestId}`);
    };

    getList = (contestId) => {
        this._loadProblems(contestId);
        let list = [];
        const dict = this.store.getState().problems.dict;
        for(let probId in dict) {
            if(dict[probId].contest === contestId) {
                list.push(dict[probId]);
            }
        }
        return list;
    }
}
