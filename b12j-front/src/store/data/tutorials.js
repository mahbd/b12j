import {basicActions, basicReducers, standardInitialState} from "../basicReducerTemplate";
import {createSlice} from "@reduxjs/toolkit";

const name = 'tutorial';

const slice = createSlice({
    name: `${name}s`,
    initialState: {
        ...standardInitialState()
    },
    reducers: {
        ...basicReducers(name),
        tutorialsReceived: (state, action) => {
            const data = action.payload.results;
            if (data.length < 1) console.log("No tutorials for this contest");
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

export class tutorialActions extends basicActions {
    constructor(store, ws) {
        super(slice, store, ws, name);
    }

    _loadTutorials = (contestId) => {
        const tutorials = this.store.getState().tutorials;
        if(tutorials.fetched.indexOf(contestId) !== -1 || tutorials.loading) return ;
        this._load(`/tutorials/?contest_id=${contestId}`);
    };

    getList = (contestId) => {
        this._loadTutorials(contestId);
        let list = [];
        const dict = this.store.getState().tutorials.dict;
        for(let dictKey in dict) {
            if(dict[dictKey].contest === contestId) {
                list.push(dict[dictKey]);
            }
        }
        return list;
    }
}
