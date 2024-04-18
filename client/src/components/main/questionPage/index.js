import "./index.css";
import QuestionHeader from "./header";
import Question from "./question";

import { getQuestionsByFilter } from "../../../services/questionService";
import { useEffect, useState } from "react";
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
  const [selectedQuestions, setSelectedQuestions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
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

  const handleDeleteSelected = () => {
    setQlist(qlist.filter((q) => !selectedQuestions.includes(q._id)));
    setSelectedQuestions([]);
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
        <button onClick={handleDeleteSelected}>
          Delete Selected{JSON.stringify(selectedQuestions)}
        </button>
        {qlist.map((q, idx) => (
          <Question
            q={q}
            key={idx}
            clickTag={clickTag}
            handleAnswer={handleAnswer}
            onDelete={handleDeleteQuestion}
            onSelect={handleSelectQuestion}
            isSelected={selectedQuestions.includes(q._id)}
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
