import {combineReducers} from "redux";
import contests from './data/contests';
import problems from './data/problems';
import users from './data/users';
import submissions from './data/submissions';
import tutorials from "./data/tutorials";


export default combineReducers({
    contests: contests,
    problems: problems,
    submissions: submissions,
    users: users,
    tutorials: tutorials,
});
