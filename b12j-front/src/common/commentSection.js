import React, {useContext} from 'react';
import {SuperContext} from "../context";
import {copyToClipBoard} from "./helperFunctions";
import {css} from "../main_css";
import {getCurrentUser} from "./authService";
import {extractDate} from "../apps/functions";

const CommentSection = ({commentList, commentCat}) => {
  const {userActs} = useContext(SuperContext);
  return (
    <div>
      <div className={css.heading4}>Comment Section</div>
      <br/>
      {getCurrentUser() && <button className={"btn btn-success"}>New Comment</button>}
      {!getCurrentUser() && <p className={"alert alert-info"}>Login to comment and reply</p>}
      {commentList.map((discussion) => commentChecker(discussion, userActs, commentCat))}
    </div>
  );
}

const commentChecker = (comment, userActs, commentCat) => {
  // console.log(comment)
  if (comment.parent) {
    let parent = document.getElementById(`${commentCat}_comment_${comment.parent}`);
    if (parent && !document.getElementById(`${commentCat}_comment_${comment.id}`)) {
      parent.appendChild(createCommentDOM(comment, userActs, commentCat));
    }
    return;
  }
  return createCommentReact(comment, userActs, commentCat);
}
const replyFunction = (commentId, commentCat) => {
  if (!document.getElementById(`${commentCat}_input_${commentId}`)) {
    const inputDiv = document.createElement("input");
    const location = document.getElementById(`${commentCat}_ic_${commentId}`);
    inputDiv.id = `${commentCat}_input_${commentId}`;
    inputDiv.type = "text";
    inputDiv.className = "form-control";
    location.appendChild(inputDiv);
    const submit = document.createElement("button");
    submit.className = "btn btn-small btn-success";
    submit.onclick = () => replyFunction(commentId, commentCat);
    submit.innerText = "Submit"
    location.appendChild(submit);
  } else {
    const location = document.getElementById(`${commentCat}_ic_${commentId}`);
    const inputDiv = document.getElementById(`${commentCat}_input_${commentId}`);
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

const createCommentReact = (comment, userActs, commentCat) => {
  return (
    <div key={comment.id} id={`${commentCat}_comment_${comment.id}`}>
      <div>{comment.text}</div>
      <div className={"text-secondary"}>
        <small>By: {userActs.fullName(comment.by)} Date: {extractDate(comment.date)}</small>
      </div>

      {getCurrentUser() && <div><span onClick={() => replyFunction(comment.id, commentCat)}
                 className={"text-primary clickable"}>Reply </span>
        {getCurrentUser().id == comment.by &&
        <span onClick={() => deleteFunction(comment.id)} className={"text-danger clickable"}>Delete</span>}
      </div>}
      <div id={`${commentCat}_ic_${comment.id}`}/>
    </div>)
}

const createCommentDOM = (comment, userActs, commentCat) => {
  const parentDiv = document.createElement("div");
  parentDiv.id = `${commentCat}_comment_${comment.id}`;
  parentDiv.className = "ps-4"
  const text = document.createElement("div");
  text.innerHTML = comment.text;
  parentDiv.appendChild(text);
  const smallTag = document.createElement("small");
  smallTag.innerText = `By: ${userActs.fullName(comment.by)} Date: ${extractDate(comment.date)}`;
  smallTag.className = "text-secondary";
  parentDiv.appendChild(smallTag);
  if (getCurrentUser()) {
    const buttons = document.createElement("div");
    const replyButton = document.createElement("span");
    replyButton.innerText = "Reply";
    replyButton.className = "text-primary clickable";
    replyButton.onclick = () => replyFunction(comment.id);
    buttons.appendChild(replyButton);
    if (getCurrentUser().id == comment.by) {
      const deleteButton = document.createElement("span");
      deleteButton.innerText = "Delete";
      deleteButton.className = "text-danger ps-1 clickable";
      deleteButton.onclick = () => deleteFunction(comment.id);
      buttons.appendChild(deleteButton);
    }
    const copyButton = document.createElement("span");
    copyButton.innerText = "Copy link";
    copyButton.className = "text-info ps-1 clickable copy-btn";
    copyButton.onclick = () => copyFunction(comment.id);
    buttons.appendChild(copyButton);
    parentDiv.appendChild(buttons);
  }
  const inputDiv = document.createElement("div");
  inputDiv.id = `${commentCat}_ic_${comment.id}`
  parentDiv.appendChild(inputDiv);
  return parentDiv;
}

export default CommentSection;