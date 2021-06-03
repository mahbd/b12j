import {createSlice} from "@reduxjs/toolkit";
import {getCurrentUser} from "../../common/authService";
import {basicActions, basicReducers, standardInitialState} from "../basicReducerTemplate";

const name = 'user'
const slice = createSlice({
    name: `${name}s`,
    initialState: {
        ...standardInitialState(),
        info: getCurrentUser(),
    },
    reducers: {
        ...basicReducers(name),

        loggedIn: (state, action) => {
            state.info = action.payload;
        },
        loggedOut: state => {
            state.info = null;
        }
    }
});
export default slice.reducer;

export class userActions extends basicActions {
    constructor(store, ws) {
        super(slice, store, ws, name);
    };

    loadUsers = () => {
        this._load('/users/?limit=1000')
    };

    getList = () => this.list(this.store.getState().users.list);

    firstName = (id) => {
        return this.getById(id, 'first_name');
    };

    fullName = (id) => {
        if (!this.getById(id, 'first_name') && !this.getById(id, 'last_name')) {
            return this.getById(id, 'username');
        }
        return this.getById(id, 'first_name') + ' ' + this.getById(id, 'last_name');
    }

    currentUser = () => {
        return this.store.getState()[`${this.name}s`].info;
    }
}
