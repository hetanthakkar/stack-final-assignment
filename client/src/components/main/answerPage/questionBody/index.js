import "./index.css";
import React from "react";
import { handleHyperlink } from "../../../../tool";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsDown, faThumbsUp } from "@fortawesome/free-solid-svg-icons";
import "@fortawesome/fontawesome-svg-core/styles.css";
// Component for the Question's Body
const QuestionBody = ({ views, text, askby, meta }) => {
  return (
    <div className="question-body-container">
      <div className="comment-votes">
        <button className="upvote" onClick={() => console.log("comment")}>
          <FontAwesomeIcon icon={faThumbsUp} />
        </button>
        <button className="downvote" onClick={() => console.log("comment")}>
          <FontAwesomeIcon icon={faThumbsDown} />
        </button>
      </div>
      <div className="question-details">
      <div className="question-header">
        <div className="question-views">
          <i className="fas fa-eye"></i>
          <span>{views} views</span>
        </div>
        <div className="question-author-meta">
          <div className="question-author">{askby}</div>
          <div className="question-meta">asked {meta}</div>
        </div>
      </div>
      <div className="question-content">{handleHyperlink(text)}</div>
      </div>
    </div>
  );
};

export default QuestionBody;
