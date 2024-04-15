import "./index.css";
import React from "react";
import { handleHyperlink } from "../../../../tool";

// Component for the Question's Body
const QuestionBody = ({ views, text, askby, meta }) => {
  return (
    <div className="question-body-container">
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
  );
};

export default QuestionBody;
