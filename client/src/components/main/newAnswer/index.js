import "./index.css";
import { useEffect, useState } from "react";
import Form from "../baseComponents/form";
import Input from "../baseComponents/input";
import Textarea from "../baseComponents/textarea";
import { validateHyperlink } from "../../../tool";
import { addAnswer } from "../../../services/answerService";
import { getLocalUser } from "../../../validation/helper";

const NewAnswer = ({ qid, handleAnswer }) => {
  const [usrn, setUsrn] = useState("");
  const [user, setUser] = useState("");
  const [text, setText] = useState("");
  const [usrnErr, setUsrnErr] = useState("");
  const [textErr, setTextErr] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      let user = await getLocalUser();
      setUser(user);
    };
    fetchData().catch((e) => console.log(e));
  }, []);
  const postAnswer = async () => {
    let isValid = true;

    if (!user) {
      setUsrnErr("Username cannot be empty");
      isValid = false;
    }

    if (!text) {
      setTextErr("Answer text cannot be empty");
      isValid = false;
    }

    // Hyperlink validation
    if (!validateHyperlink(text)) {
      setTextErr("Invalid hyperlink format.");
      isValid = false;
    }

    if (!isValid) {
      return;
    }

    const answer = {
      text: text,
      ans_by: user?.username,
      ans_date_time: new Date(),
    };

    const res = await addAnswer(qid, answer);
    if (res && res._id) {
      handleAnswer(qid);
    }
  };
  return (
    <Form>
      <Input
        title={"Username"}
        id={"answerUsernameInput"}
        val={user?.username}
        edi
        setState={setUsrn}
        err={usrnErr}
      />
      <Textarea
        title={"Answer Text"}
        id={"answerTextInput"}
        val={text}
        setState={setText}
        err={textErr}
      />
      <div className="btn_indicator_container">
        <button
          className="form_postBtn"
          onClick={() => {
            postAnswer();
          }}
        >
          Post Answer
        </button>
        <div className="mandatory_indicator">* indicates mandatory fields</div>
      </div>
    </Form>
  );
};

export default NewAnswer;
