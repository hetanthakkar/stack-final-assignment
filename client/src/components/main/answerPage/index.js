import { useEffect, useState } from "react";
import { getMetaData } from "../../../tool";
import Answer from "./answer";
import AnswerHeader from "./header";
import "./index.css";
import QuestionBody from "./questionBody";
import { getQuestionById } from "../../../services/questionService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsDown, faThumbsUp } from "@fortawesome/free-solid-svg-icons";
import "@fortawesome/fontawesome-svg-core/styles.css";

const AnswerPage = ({ qid, handleNewQuestion, handleNewAnswer }) => {
  const [question, setQuestion] = useState({});
  const [isQuestionDialogOpen, setIsQuestionDialogOpen] = useState(false);
  const [isAnswerDialogOpen, setIsAnswerDialogOpen] = useState(false);
  const [questionComment, setQuestionComment] = useState("");
  const [answerComment, setAnswerComment] = useState("");
  const [questionComments, setQuestionComments] = useState([]);
  const [answerComments, setAnswerComments] = useState([]);
  const [currentAnswerIndex, setCurrentAnswerIndex] = useState(null);

  const openQuestionDialog = () => {
    setIsQuestionDialogOpen(true);
  };

  const closeQuestionDialog = () => {
    setIsQuestionDialogOpen(false);
    setQuestionComment("");
  };

  const openAnswerDialog = (index) => {
    setCurrentAnswerIndex(index);
    setIsAnswerDialogOpen(true);
  };

  const closeAnswerDialog = () => {
    setIsAnswerDialogOpen(false);
    setAnswerComment("");
  };

  const handleQuestionCommentChange = (event) => {
    setQuestionComment(event.target.value);
  };

  const handleAnswerCommentChange = (event) => {
    setAnswerComment(event.target.value);
  };

  const submitQuestionComment = () => {
    if (questionComment.trim() !== "") {
      const newComment = {
        id: Date.now(),
        text: questionComment,
        author: "You", // You can change this to the actual author
        date: new Date().toLocaleString(), // Current date and time
        upvotes: 0,
        downvotes: 0,
      };
      setQuestionComments([...questionComments, newComment]);
      setQuestionComment("");
      closeQuestionDialog();
    }
  };

  const submitAnswerComment = () => {
    if (answerComment.trim() !== "") {
      const newComment = {
        id: Date.now(),
        text: answerComment,
        author: "You", // You can change this to the actual author
        date: new Date().toLocaleString(), // Current date and time
        upvotes: 0,
        downvotes: 0,
      };
      const updatedAnswers = [...question.answers];
      updatedAnswers[currentAnswerIndex].comments = [
        ...(updatedAnswers[currentAnswerIndex].comments || []),
        newComment,
      ];
      setQuestion({ ...question, answers: updatedAnswers });
      setAnswerComment("");
      closeAnswerDialog();
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      let res = await getQuestionById(qid);
      setQuestion(res || {});
    };
    fetchData().catch((e) => console.log(e));
  }, [qid]);

  const handleUpvote = (type, id) => {
    // Implement upvoting logic here
    console.log(`Upvoted ${type} with id ${id}`);
  };

  const handleDownvote = (type, id) => {
    // Implement downvoting logic here
    console.log(`Downvoted ${type} with id ${id}`);
  };

  return (
    <>
      <AnswerHeader
        ansCount={question && question.answers && question.answers.length}
        title={question && question.title}
        handleNewQuestion={handleNewQuestion}
      />
      <QuestionBody
        views={question && question.views}
        text={question && question.text}
        askby={question && question.asked_by}
        meta={question && getMetaData(new Date(question.ask_date_time))}
      />
      <button className="bluebtn ansButton" onClick={openQuestionDialog}>
        Add Comment to Question
      </button>
      {isQuestionDialogOpen && (
        <div className="comment_dialog">
          <div className="comment_dialog_content">
            <textarea
              className="comment_textarea"
              value={questionComment}
              onChange={handleQuestionCommentChange}
              placeholder="Enter your comment here..."
            ></textarea>
            <div className="comment_dialog_buttons">
              <button className="cancel_button" onClick={closeQuestionDialog}>
                Cancel
              </button>
              <button className="submit_button" onClick={submitQuestionComment}>
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
      {questionComments.length > 0 && (
        <div className="comments-section">
          <h3>Comments:</h3>
          {questionComments.map((c) => (
            <div key={c.id} className="comment comment-indented">
              <div className="comment-header">
                <p className="comment-author">{c.author}</p>
                <p className="comment-date">{c.date}</p>
                <div className="comment-votes">
                  <button onClick={() => handleUpvote("comment", c.id)}>
                    <FontAwesomeIcon icon={faThumbsUp} />
                  </button>
                  <button onClick={() => handleDownvote("comment", c.id)}>
                    <FontAwesomeIcon icon={faThumbsDown} />
                  </button>
                </div>
              </div>
              <p className="comment-text">{c.text}</p>
            </div>
          ))}
        </div>
      )}
      <div className="answers-separator">
        Answers ({question.answers ? question.answers.length : 0})
      </div>
      <div className="answers-container">
        {question &&
          question.answers &&
          question.answers.map((a, idx) => (
            <div key={idx} className="answer-container">
              <div className="comment-votes">
                <button onClick={() => handleUpvote("comment", 10)}>
                  <FontAwesomeIcon icon={faThumbsUp} />
                </button>
                <button onClick={() => handleDownvote("comment", 10)}>
                  <FontAwesomeIcon icon={faThumbsDown} />
                </button>
              </div>
              <Answer
                text={a.text}
                ansBy={a.ans_by}
                meta={getMetaData(new Date(a.ans_date_time))}
              />

              <div className="comments-section">
                <button
                  className="bluebtn ansButton"
                  onClick={() => openAnswerDialog(idx)}
                >
                  Reply
                </button>
                {a.comments && a.comments.length > 0 && (
                  <>
                    {a.comments.map((c) => (
                      <div key={c.id} className="comment comment-indented">
                        <div className="comment-header">
                          <p className="comment-author">{c.author}</p>
                          <p className="comment-date">{c.date}</p>
                          <div className="comment-votes">
                            <button
                              onClick={() => handleUpvote("comment", c.id)}
                            >
                              <FontAwesomeIcon icon={faThumbsUp} />
                            </button>
                            <button
                              onClick={() => handleDownvote("comment", c.id)}
                            >
                              <FontAwesomeIcon icon={faThumbsDown} />
                            </button>
                          </div>
                        </div>
                        <p className="comment-text">{c.text}</p>
                      </div>
                    ))}
                  </>
                )}
              </div>
            </div>
          ))}
      </div>
      {isAnswerDialogOpen && (
        <div className="comment_dialog">
          <div className="comment_dialog_content">
            <textarea
              className="comment_textarea"
              value={answerComment}
              onChange={handleAnswerCommentChange}
              placeholder="Enter your comment here..."
            ></textarea>
            <div className="comment_dialog_buttons">
              <button className="cancel_button" onClick={closeAnswerDialog}>
                Cancel
              </button>
              <button className="submit_button" onClick={submitAnswerComment}>
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AnswerPage;
