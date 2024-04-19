const express = require("express");
const Question = require("../models/questions");

const {
  addTag,
  getQuestionsByOrder,
  filterQuestionsBySearch,
} = require("../utils/question");
const comments = require("../models/comments");

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
    const userId = req.body.userId; // Assuming you have middleware to get the current user ID

    let question = await Question.findOneAndUpdate(
      {
        _id: questionId,
        views: { $ne: userId }, // Check if the user ID is not already present in the views array
      },
      {
        $push: { views: userId }, // Add the user ID to the views array
        $inc: { viewCount: 1 }, // Increment the viewCount field
      },
      { new: true }
    );

    if (!question) {
      // If the user ID is already present in the views array, fetch the question without updating
      question = await Question.findById(questionId);
    }

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

router.put("/:id/vote", async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) return res.status(404).json({ msg: "Question not found" });

    const userId = req.body.userId; // Assuming you have middleware to get the current user

    // Check if the user has already upvoted
    if (question.upvotes.includes(userId)) {
      // Remove the upvote
      question.upvotes = question.upvotes.filter(
        (id) => id.toString() !== userId.toString()
      );
    }

    // Check if the user has already downvoted
    if (question.downvotes.includes(userId)) {
      // Remove the downvote
      question.downvotes = question.downvotes.filter(
        (id) => id.toString() !== userId.toString()
      );
    }

    const voteType = req.body.voteType; // 'upvote' or 'downvote'
    if (voteType === "upvote") {
      question.upvotes.push(userId);
    } else if (voteType === "downvote") {
      question.downvotes.push(userId);
    } else {
      return res.status(400).json({ msg: "Invalid vote type" });
    }

    await question.save();

    res.json({ msg: `Question ${voteType}d successfully` });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

router.post("/:id/comments", async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) return res.status(404).json({ msg: "Question not found" });

    const { text, posted_by } = req.body;

    const newComment = new comments({
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
router.delete("/:questionId/comments/:commentId", async (req, res) => {
  try {
    const question = await Question.findById(req.params.questionId);
    if (!question) return res.status(404).json({ msg: "question not found" });

    const comment = await comments.findById(req.params.commentId);
    if (!comment) return res.status(404).json({ msg: "Comment not found" });

    // Check if the comment belongs to the answer
    if (!question.comments.includes(comment._id)) {
      return res
        .status(400)
        .json({ msg: "Comment does not belong to this answer" });
    }

    // Remove the comment from the answer
    question.comments = question.comments.filter(
      (id) => id.toString() !== comment._id.toString()
    );
    await question.save();

    // Remove the comment from the database
    await comments.findOneAndDelete({ _id: req.params.commentId });

    res.json({ msg: "Comment removed successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
