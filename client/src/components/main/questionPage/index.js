import "./index.css";
import QuestionHeader from "./header";
import Question from "./question";

import { getQuestionsByFilter } from "../../../services/questionService";
import { useEffect, useState } from "react";
import { getLocalUser } from "../../../validation/helper";
// QuestionPage component
const QuestionPage = ({
  title_text = "All Questions",
  order,
  search,
  setQuestionOrder,
  clickTag,
  handleAnswer,
  handleNewQuestion,
}) => {
  const [qlist, setQlist] = useState([]);
  const [user, setUser] = useState(null);
  const [selectedQuestions, setSelectedQuestions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      let user = await getLocalUser();
      setUser(user);
      let res = await getQuestionsByFilter(order, search);
      setQlist(res || []);
    };
    fetchData().catch((e) => console.log(e));
  }, [order, search]);

  const handleDeleteQuestion = (id) => {
    setQlist(qlist.filter((q) => q._id !== id));
    setSelectedQuestions(selectedQuestions.filter((qId) => qId !== id));
  };

  const handleSelectQuestion = (id) => {
    if (selectedQuestions.includes(id)) {
      setSelectedQuestions(selectedQuestions.filter((qId) => qId !== id));
    } else {
      setSelectedQuestions([...selectedQuestions, id]);
    }
  };
  const handleDeleteSelected = async () => {
    try {
      // Delete each selected question from the server
      const promises = selectedQuestions.map(async (qid) => {
        console.log("id is", qid);
        await fetch(`http://localhost:8000/question/${qid}`, {
          method: "DELETE",
        });
      });
      await Promise.all(promises);

      // Update the state by filtering out the deleted questions
      const updatedQlist = qlist.filter(
        (q) => !selectedQuestions.includes(q._id)
      );
      setQlist(updatedQlist);
      setSelectedQuestions([]);
    } catch (error) {
      console.error("Error deleting selected questions:", error);
    }
  };

  return (
    <>
      <QuestionHeader
        title_text={title_text}
        qcnt={qlist.length}
        setQuestionOrder={setQuestionOrder}
        handleNewQuestion={handleNewQuestion}
      />
      <div id="question_list" className="question_list">
        {user?.isModerator && (
          <button onClick={handleDeleteSelected}>Delete Selecsted</button>
        )}
        {qlist.map((q, idx) => (
          <Question
            q={q}
            key={idx}
            clickTag={clickTag}
            handleAnswer={handleAnswer}
            onDelete={handleDeleteQuestion}
            onSelect={handleSelectQuestion}
            isSelected={selectedQuestions.includes(q._id)}
            isModerator={user?.isModerator}
          />
        ))}
      </div>
      {title_text === "Search Results" && !qlist.length && (
        <div className="bold_title right_padding">No Questions Found</div>
      )}
    </>
  );
};

export default QuestionPage;
