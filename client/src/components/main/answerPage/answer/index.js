import { handleHyperlink } from "../../../../tool";
import "./index.css";

// Component for the Answer Page
const Answer = ({ text, ansBy, meta }) => {
  return (
    <div className="answer-container">
      <div className="answer-content">
        <div id="answerText" className="answer-text">
          {handleHyperlink(text)}
        </div>
        <div className="answer-author-meta">
          <div className="answer-author">{ansBy}</div>
          <div className="answer-meta">{meta}</div>
        </div>
      </div>
    </div>
  );
};

export default Answer;
