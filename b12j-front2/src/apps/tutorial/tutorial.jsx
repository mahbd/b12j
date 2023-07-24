import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { SuperContext } from "../../context";
import { FormattedHtml } from "../../components/helperFunctions";
import { urls } from "../../configuration";
import { getCurrentUser } from "../../components/authService";

const Tutorial = ({ match }) => {
   const { tutorialActs} = useContext(SuperContext);
   const { tutorialId } = match.params;
   const tutorial = tutorialActs.getById(tutorialId);
   const userId = getCurrentUser() && getCurrentUser().id;

   return (
      tutorial && (
         <div className="container">
            {userId && tutorial.by === userId && (
               <div>
                  <Link to={`${urls.editTutorial}/${tutorialId}`} className={"btn btn-warning"}>
                     Edit
                  </Link>
               </div>
            )}
            <div className="row pt-2 pb-5">
               <div className="col">
                  <Link to={"/tutorials"} className={"white-link"}>
                     Back
                  </Link>
               </div>
               <h1 className={"col-auto display-4 fw-bold text-secondary rounded-3"}>{tutorial.title}</h1>
               <div className="col" />
            </div>

            <div>
               {tutorial.notice && <div className="alert alert-info">{tutorial.notice}</div>}
               <FormattedHtml text={tutorial.text} />
            </div>

            {/*<CommentSection commentList={commentList} commentCat={"tutorial"} />*/}
         </div>
      )
   );
};

export default Tutorial;
