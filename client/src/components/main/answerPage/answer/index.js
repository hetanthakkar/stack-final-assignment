import { handleHyperlink } from "../../../../tool";
import "./index.css";
const Answer = ({ text, ansBy, meta, onDelete, onSelect, isSelected }) => {
  const handleCheckboxChange = () => {
    onSelect();
  };

  const handleDelete = () => {
    onDelete();
  };

  return (
    <div className="answer-container">
      <input
        type="checkbox"
        checked={isSelected}
        onChange={handleCheckboxChange}
      />
      <div className="answer-content">
        <div id="answerText" className="answer-text">
          {handleHyperlink(text)}
        </div>
        <div className="answer-author-meta">
          <div className="answer-author">{ansBy}</div>
          <div className="answer-meta">{meta}</div>
        </div>
      </div>
      <button onClick={handleDelete}>Delete</button>
    </div>
  );
};
export default Answer;
