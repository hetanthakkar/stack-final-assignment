const express = require("express");
const Question = require("../models/questions");

const {
  addTag,
  getQuestionsByOrder,
  filterQuestionsBySearch,
} = require("../utils/question");

const router = express.Router();

const getQuestionsByFilter = async (req, res) => {
  try {
    const order = req.query.order || "newest";
    const search = req.query.search || "";
    let questions = await getQuestionsByOrder(order);
    questions = filterQuestionsBySearch(questions, search);
    res.status(200);
    res.json(questions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Internal server error" });
  }
};

const getQuestionById = async (req, res) => {
  try {
    const questionId = req.params.id;
    let question = await Question.findOneAndUpdate(
      { _id: questionId },
      { $inc: { views: 1 } },
      { new: true }
    );
    question = await question.populate("answers");
    res.status(200);
    res.json(question);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Internal server error" });
  }
};

const addQuestion = async (req, res) => {
  let tags = await Promise.all(
    req.body.tags.map(async (tag) => {
      return await addTag(tag);
    })
  );
  let question = await Question.create({
    title: req.body.title,
    text: req.body.text,
    asked_by: req.body.asked_by,
    ask_date_time: req.body.ask_date_time,
    tags: tags,
  });
  res.json(question);
};

router.get("/getQuestion", (req, res) => {
  getQuestionsByFilter(req, res).then((data) => {
    return data;
  });
});

router.get("/getQuestionById/:id", (req, res) =>
  getQuestionById(req, res).then((data) => {
    return data;
  })
);

router.post("/addQuestion", (req, res) =>
  addQuestion(req, res).then((data) => {
    return data;
  })
);

// Upvote a question
router.put("/questions/:id/upvote", async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) return res.status(404).json({ msg: "Question not found" });

    const userId = req.user._id; // Assuming you have middleware to get the current user

    // Check if the user has already upvoted
    if (question.upvotes.includes(userId)) {
      return res
        .status(400)
        .json({ msg: "You have already upvoted this question" });
    }

    // Check if the user has downvoted and remove the downvote
    if (question.downvotes.includes(userId)) {
      question.downvotes = question.downvotes.filter(
        (id) => id.toString() !== userId.toString()
      );
    }

    question.upvotes.push(userId);
    await question.save();

    res.json({ msg: "Question upvoted successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// Downvote a question
router.put("/questions/:id/downvote", async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) return res.status(404).json({ msg: "Question not found" });

    const userId = req.user._id; // Assuming you have middleware to get the current user

    // Check if the user has already downvoted
    if (question.downvotes.includes(userId)) {
      return res
        .status(400)
        .json({ msg: "You have already downvoted this question" });
    }

    // Check if the user has upvoted and remove the upvote
    if (question.upvotes.includes(userId)) {
      question.upvotes = question.upvotes.filter(
        (id) => id.toString() !== userId.toString()
      );
    }

    question.downvotes.push(userId);
    await question.save();

    res.json({ msg: "Question downvoted successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

router.post("/questions/:id/comments", async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) return res.status(404).json({ msg: "Question not found" });

    const { text, posted_by } = req.body;

    const newComment = new Comment({
      text,
      posted_by,
      posted_date_time: Date.now(),
    });

    const comment = await newComment.save();

    question.comments.push(comment._id);
    await question.save();

    res.json(comment);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

router.delete(
  "/questions/:questionId/comments/:commentId",
  async (req, res) => {
    try {
      const question = await Question.findById(req.params.questionId);
      if (!question) return res.status(404).json({ msg: "Question not found" });

      const comment = await Comment.findById(req.params.commentId);
      if (!comment) return res.status(404).json({ msg: "Comment not found" });

      // Check if the comment belongs to the question
      if (!question.comments.includes(comment._id)) {
        return res
          .status(400)
          .json({ msg: "Comment does not belong to this question" });
      }

      // Remove the comment from the question
      question.comments = question.comments.filter(
        (id) => id.toString() !== comment._id.toString()
      );
      await question.save();

      // Remove the comment from the database
      await Comment.findByIdAndRemove(req.params.commentId);

      res.json({ msg: "Comment removed successfully" });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

module.exports = router;
