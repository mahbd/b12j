import { combineReducers } from "redux";
import contests from "./data/contests";
import problems from "./data/problems";
import users from "./data/users";
import submissions from "./data/submissions";
import tutorials from "./data/tutorials";
import problemDiscussions from "./data/problemDiscussion";
import tutorialDiscussions from "./data/tutorialDiscussion";

export default combineReducers({
   contests,
   problems,
   problemDiscussions,
   submissions,
   tutorials,
   tutorialDiscussions,
   users,
});
