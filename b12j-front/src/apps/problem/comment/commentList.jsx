import React, {useContext} from 'react';
import {SuperContext} from "../../../context";
import {copyToClipBoard} from "../../../common/helperFunctions";
import {css} from "../../../main_css";

const ProblemComments = ({problemId}) => {
  const {problemDiscussionActs, userActs} = useContext(SuperContext);
  const discussions = problemDiscussionActs.getList(problemId);

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
    if (parent && !document.getElementById(`comment_${comment.id}`)) {
      parent.appendChild(createCommentDOM(comment, userActs));
    }
    return;
  }
  return createCommentReact(comment, userActs);
}
const replyFunction = (commentId) => {
  if (!document.getElementById(`input_${commentId}`)) {
    const inputDiv = document.createElement("input");
    const location = document.getElementById(`ic_${commentId}`);
    inputDiv.id = `input_${commentId}`;
    inputDiv.type = "text";
    inputDiv.className = "form-control";
    location.appendChild(inputDiv);
    const submit = document.createElement("button");
    submit.className = "btn btn-small btn-success";
    submit.onclick = () => replyFunction(commentId);
    submit.innerText = "Submit"
    location.appendChild(submit);
  } else {
    const location = document.getElementById(`ic_${commentId}`);
    const inputDiv = document.getElementById(`input_${commentId}`);
    const text = inputDiv.value;
    while (location.hasChildNodes()) location.firstChild.remove();
    console.log("This value inserted", text);
  }
}

const deleteFunction = (commentId) => {
  console.log("Deleting", commentId)
}

const copyFunction = (commentId) => {
  const link = document.createElement("a");
  link.href = `#comment_${commentId}`;
  link.click();
  console.log(document.URL)
  copyToClipBoard(document.URL.toString());
}

const createCommentReact = (comment, userActs) => {
  return (
    <div key={comment.id} id={`comment_${comment.id}`}>
      <div className={"text-secondary"}>
        <small>By: {userActs.fullName(comment.by)} Date: {comment.date}</small>
      </div>
      <div>{comment.text}</div>
      <div><span onClick={() => replyFunction(comment.id)} className={"text-primary clickable"}>Reply </span>
        <span onClick={() => deleteFunction(comment.id)} className={"text-danger clickable"}>Delete</span>
      </div>
      <div id={`ic_${comment.id}`}/>
    </div>)
}

const createCommentDOM = (comment, userActs) => {

  const parentDiv = document.createElement("div");
  parentDiv.id = `comment_${comment.id}`;
  parentDiv.className = "ps-4"
  const smallTag = document.createElement("small");
  smallTag.innerText = `By: ${userActs.fullName(comment.by)} Date: ${comment.date}`;
  smallTag.className = "text-secondary";
  parentDiv.appendChild(smallTag);
  const text = document.createElement("div");
  text.innerHTML = comment.text;
  parentDiv.appendChild(text);
  const buttons = document.createElement("div");
  const replyButton = document.createElement("span");
  replyButton.innerText = "Reply";
  replyButton.className = "text-primary clickable";
  replyButton.onclick = () => replyFunction(comment.id);
  buttons.appendChild(replyButton);
  const deleteButton = document.createElement("span");
  deleteButton.innerText = "Delete";
  deleteButton.className = "text-danger ps-1 clickable";
  deleteButton.onclick = () => deleteFunction(comment.id);
  buttons.appendChild(deleteButton);
  const copyButton = document.createElement("span");
  copyButton.innerText = "Copy link";
  copyButton.className = "text-info ps-1 clickable copy-btn";
  copyButton.onclick = () => copyFunction(comment.id);
  buttons.appendChild(copyButton);
  parentDiv.appendChild(buttons);
  const inputDiv = document.createElement("div");
  inputDiv.id = `ic_${comment.id}`
  parentDiv.appendChild(inputDiv);
  return parentDiv;
}

export default ProblemComments;