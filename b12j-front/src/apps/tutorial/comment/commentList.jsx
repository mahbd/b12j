import React, {useContext} from 'react';
import ReactDomServer from "react-dom/server"
import {SuperContext} from "../../../context";
import {css} from "../../../main_css";
import {getCurrentUser} from "../../../common/authService";

const TutorialComments = ({tutorialId}) => {
  const {tutorialDiscussionActs, userActs} = useContext(SuperContext);
  const discussions = tutorialDiscussionActs.getList(tutorialId);

  return (
    <div>
      <div className={css.heading4}>Comment Section</div>
      <br/>
      <button className={"btn btn-success"}>New Comment</button>
      {discussions.map((discussion) => commentChecker(discussion, userActs))}
    </div>
  );
}

const commentChecker = (comment, userActs) => {
  // console.log(comment)
  if (comment.parent) {
    let parent = document.getElementById(`comment_${comment.parent}`);
    let p = document.createElement('div');
    p.className = "ps-4"
    if (parent && !document.getElementById(`comment_${comment.id}`)) {
      p.innerHTML = ReactDomServer.renderToStaticMarkup(commentRender(comment, userActs));
      parent.appendChild(p);
    }
    return;
  }
  return commentRender(comment, userActs)
}

const commentRender = (comment, userActs) => {
  const currentUser = getCurrentUser() && getCurrentUser().id;
  return (
    <div key={comment.id} id={`comment_${comment.id}`}>
      <div className={"text-secondary"}><small>By: {userActs.fullName(comment.by)} Date: {comment.date}</small></div>
      <div>{comment.text}</div>
      <div>
        <span className={"text-primary"}>Reply</span>
        {currentUser == comment.by && <span className={"text-danger"}>Delete</span>}
      </div>
    </div>)
}

export default TutorialComments;