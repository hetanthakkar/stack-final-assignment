import { useEffect, useState } from "react";
import { getMetaData } from "../../../tool";
import Answer from "./answer";
import AnswerHeader from "./header";
import "./index.css";
import QuestionBody from "./questionBody";
import {
  getQuestionById,
  deleteCommentFromQuestion,
} from "../../../services/questionService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsDown, faThumbsUp } from "@fortawesome/free-solid-svg-icons";
import "@fortawesome/fontawesome-svg-core/styles.css";
import {
  addCommentToAnswer,
  addCommentToQuestion,
  deleteCommentFromAnswer,
  downvoteAnswer,
  downvoteQuestion,
  upvoteAnswer,
  upvoteQuestion,
} from "../../../validation/helper";

const AnswerPage = ({ qid, handleNewQuestion, handleNewAnswer }) => {
  const [question, setQuestion] = useState({});
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [selectedComments, setSelectedComments] = useState([]);
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
  const handleSelectAnswer = (index) => {
    if (selectedAnswers.includes(index)) {
      setSelectedAnswers(selectedAnswers.filter((i) => i !== index));
    } else {
      setSelectedAnswers([...selectedAnswers, index]);
    }
  };

  const handleDeleteSelectedAnswers = () => {
    const updatedAnswers = question.answers.filter(
      (_, idx) => !selectedAnswers.includes(idx)
    );
    setQuestion({ ...question, answers: updatedAnswers });
    setSelectedAnswers([]);
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

  const submitQuestionComment = async () => {
    if (questionComment.trim() !== "") {
      await addCommentToQuestion(qid, questionComment, "You");
      setQuestionComments([
        ...questionComments,
        {
          id: Date.now(),
          text: questionComment,
          author: "You",
          date: new Date().toLocaleString(),
          upvotes: 0,
          downvotes: 0,
        },
      ]);
      setQuestionComment("");
      closeQuestionDialog();
    }
  };

  const submitAnswerComment = async () => {
    if (answerComment.trim() !== "") {
      await addCommentToAnswer(
        question.answers[currentAnswerIndex].id,
        answerComment,
        "You"
      );
      const updatedAnswers = [...question.answers];
      updatedAnswers[currentAnswerIndex] = {
        ...updatedAnswers[currentAnswerIndex],
        comments: [
          ...(updatedAnswers[currentAnswerIndex].comments || []),
          {
            id: Date.now(),
            text: answerComment,
            author: "You",
            date: new Date().toLocaleString(),
            upvotes: 0,
            downvotes: 0,
          },
        ],
      };
      setQuestion({ ...question, answers: updatedAnswers });
      setAnswerComment("");
      closeAnswerDialog();
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      let res = await getQuestionById(qid);
      if (res.answers) {
        res.answers.forEach((answer) => {
          if (!answer.comments) {
            answer.comments = [];
          }
        });
      }
      setQuestion(res || {});
    };
    fetchData().catch((e) => console.log(e));
  }, [qid]);

  const handleUpvote = async (type, id) => {
    if (type === "question") {
      await upvoteQuestion(qid);
      setQuestion({ ...question, upvotes: question.upvotes + 1 });
    } else if (type === "answer") {
      console.log(question.answers[id]._id);
      await upvoteAnswer(question.answers[id]._id);
      const updatedAnswers = [...question.answers];
      updatedAnswers[id] = {
        ...updatedAnswers[id],
        upvotes: updatedAnswers[id].upvotes + 1,
      };
      setQuestion({ ...question, answers: updatedAnswers });
    } else if (type === "comment") {
      const updatedAnswers = [...question.answers];
      const answerComments = updatedAnswers[id].comments.map((comment) =>
        comment.id === id
          ? { ...comment, upvotes: comment.upvotes + 1 }
          : comment
      );
      updatedAnswers[id].comments = answerComments;
      setQuestion({ ...question, answers: updatedAnswers });
    }
  };

  const handleDownvote = async (type, id) => {
    if (type === "question") {
      await downvoteQuestion(qid);
      setQuestion({
        ...question,
        downvotes: question.downvotes + 1,
      });
    } else if (type === "answer") {
      await downvoteAnswer(question.answers[id].id);
      const updatedAnswers = [...question.answers];
      updatedAnswers[id] = {
        ...updatedAnswers[id],
        downvotes: updatedAnswers[id].downvotes + 1,
      };
      setQuestion({ ...question, answers: updatedAnswers });
    } else if (type === "comment") {
      const updatedAnswers = [...question.answers];
      const answerComments = updatedAnswers[id].comments.map((comment) =>
        comment.id === id
          ? { ...comment, downvotes: comment.downvotes + 1 }
          : comment
      );
      updatedAnswers[id].comments = answerComments;
      setQuestion({ ...question, answers: updatedAnswers });
    }
  };
  // const handleDeleteAnswer = (index) => {
  //   const updatedAnswers = question.answers.filter((_, idx) => idx !== index);
  //   setQuestion({ ...question, answers: updatedAnswers });
  // };
  const handleDeleteAnswer = (answerIndex) => {
    const updatedAnswers = question.answers.filter(
      (_, idx) => idx !== answerIndex
    );
    setQuestion({ ...question, answers: updatedAnswers });
    setSelectedAnswers([]);
  };
  const handleDeleteComment = async (answerIndex, commentId) => {
    await deleteCommentFromAnswer(question.answers[answerIndex].id, commentId);
    const updatedAnswers = [...question.answers];
    updatedAnswers[answerIndex].comments = updatedAnswers[
      answerIndex
    ].comments.filter((c) => c.id !== commentId);
    setQuestion({ ...question, answers: updatedAnswers });
    setSelectedComments(selectedComments.filter((id) => id !== commentId));
  };
  const handleSelectComment = (commentId) => {
    if (selectedComments.includes(commentId)) {
      setSelectedComments(selectedComments.filter((id) => id !== commentId));
    } else {
      setSelectedComments([...selectedComments, commentId]);
    }
  };

  const handleDeleteSelectedComments = () => {
    const updatedAnswers = question.answers.map((ans) => ({
      ...ans,
      comments: ans.comments.filter((c) => !selectedComments.includes(c.id)),
    }));
    setQuestion({ ...question, answers: updatedAnswers });
    setSelectedComments([]);
  };

  return (
    <>
      <AnswerHeader
        ansCount={question && question.answers && question.answers.length}
        title={question && question.title}
        handleNewQuestion={handleNewQuestion}
      />
      <div>
        <QuestionBody
          views={question && question.views}
          text={question && question.text}
          askby={question && question.asked_by}
          handleUpvote={handleUpvote}
          handleDownvote={handleDownvote}
          meta={question && getMetaData(new Date(question.ask_date_time))}
        />
        {selectedAnswers.length > 0 && (
          <button onClick={handleDeleteSelectedAnswers}>
            Delete Selected Answers
          </button>
        )}
        <div>
          <div className="CommentForQuestion" onClick={openQuestionDialog}>
            Add Comment to Question
          </div>
          {questionComments.length > 0 && (
            <div className="comments-section">
              <h3>Comments:</h3>
              {questionComments.map((c, id) => (
                <div key={c.id} className="comment comment-indented">
                  <div className="comment-header">
                    <p className="comment-author">{c.author}</p>
                    <p className="comment-date">{c.date}</p>
                    <div className="comment-votes-1">
                      <button onClick={() => handleUpvote("comment", id, c)}>
                        <FontAwesomeIcon icon={faThumbsUp} /> {c.upvotes}
                      </button>
                      <button onClick={() => handleDownvote("comment", c.id)}>
                        <FontAwesomeIcon icon={faThumbsDown} /> {c.downvotes}
                      </button>
                    </div>
                  </div>
                  <p className="comment-text">{c.text}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
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

      <div className="answers-separator">
        Answers ({question.answers ? question.answers.length : 0})
      </div>
      <div className="answers-container">
        {question &&
          question.answers &&
          question.answers.map((a, idx) => (
            <div key={idx} className="answer-container">
              <div className="answersForQuestion">
                <div className="comment-votes-1">
                  <button onClick={() => handleUpvote("answer", idx)}>
                    <FontAwesomeIcon icon={faThumbsUp} />
                  </button>
                  <button onClick={() => handleDownvote("answer", idx)}>
                    <FontAwesomeIcon icon={faThumbsDown} />
                  </button>
                </div>
                <Answer
                  className="CommentAnswer"
                  text={a.text}
                  ansBy={a.ans_by}
                  meta={getMetaData(new Date(a.ans_date_time))}
                  onDelete={() => handleDeleteAnswer(idx)}
                  onSelect={() => handleSelectAnswer(idx)}
                  isSelected={selectedAnswers.includes(idx)}
                />
              </div>

              <div className="comments-section">
                <button
                  className="ansButton"
                  onClick={() => openAnswerDialog(idx)}
                >
                  Reply
                </button>
                {a.comments && a.comments.length > 0 && (
                  <>
                    {a.comments.map((c) => (
                      <div className="main_div">
                        <div className="comment-votes-1">
                          <button onClick={() => handleUpvote("comment", c.id)}>
                            <FontAwesomeIcon icon={faThumbsUp} />
                          </button>
                          <button
                            onClick={() => handleDownvote("comment", c.id)}
                          >
                            <FontAwesomeIcon icon={faThumbsDown} />
                          </button>
                        </div>
                        <div key={c.id} className="answer-container">
                          <div className="comment-header">
                            <p className="comment-author">{c.author}</p>
                            <p className="comment-date">{c.date}</p>
                          </div>
                          <p className="comment-text">{c.text}</p>
                        </div>
                        <button onClick={() => handleDeleteComment(idx, c.id)}>
                          Delete
                        </button>
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
