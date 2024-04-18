const express = require("express");
const Answer = require("../models/answers");
const Question = require("../models/questions");

const router = express.Router();

router.post("/addAnswer", async (req, res) => {
  try {
    const answer = await Answer.create(req.body.ans);
    const qid = req.body.qid;
    const updatedQuestion = await Question.findByIdAndUpdate(
      qid,
      { $push: { answers: { $each: [answer._id], $position: 0 } } },
      { new: true }
    );
    res.json(answer);
  } catch (error) {
    console.error("Error:", error);
    res.status(404).json({ error: "An error occurred" });
  }
});

// Upvote an answer
router.put("/answers/:id/upvote", async (req, res) => {
  try {
    const answer = await Answer.findById(req.params.id);
    if (!answer) return res.status(404).json({ msg: "Answer not found" });

    const userId = req.user._id; // Assuming you have middleware to get the current user

    // Check if the user has already upvoted
    if (answer.upvotes.includes(userId)) {
      return res
        .status(400)
        .json({ msg: "You have already upvoted this answer" });
    }

    // Check if the user has downvoted and remove the downvote
    if (answer.downvotes.includes(userId)) {
      answer.downvotes = answer.downvotes.filter(
        (id) => id.toString() !== userId.toString()
      );
    }

    answer.upvotes.push(userId);
    await answer.save();

    res.json({ msg: "Answer upvoted successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// Downvote an answer
router.put("/answers/:id/downvote", async (req, res) => {
  try {
    const answer = await Answer.findById(req.params.id);
    if (!answer) return res.status(404).json({ msg: "Answer not found" });

    const userId = req.user._id; // Assuming you have middleware to get the current user

    // Check if the user has already downvoted
    if (answer.downvotes.includes(userId)) {
      return res
        .status(400)
        .json({ msg: "You have already downvoted this answer" });
    }

    // Check if the user has upvoted and remove the upvote
    if (answer.upvotes.includes(userId)) {
      answer.upvotes = answer.upvotes.filter(
        (id) => id.toString() !== userId.toString()
      );
    }

    answer.downvotes.push(userId);
    await answer.save();

    res.json({ msg: "Answer downvoted successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

outer.post("/answers/:id/comments", async (req, res) => {
  try {
    const answer = await Answer.findById(req.params.id);
    if (!answer) return res.status(404).json({ msg: "Answer not found" });

    const { text, posted_by } = req.body;

    const newComment = new Comment({
      text,
      posted_by,
      posted_date_time: Date.now(),
    });

    const comment = await newComment.save();

    answer.comments.push(comment._id);
    await answer.save();

    res.json(comment);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

router.delete("/answers/:answerId/comments/:commentId", async (req, res) => {
  try {
    const answer = await Answer.findById(req.params.answerId);
    if (!answer) return res.status(404).json({ msg: "Answer not found" });

    const comment = await Comment.findById(req.params.commentId);
    if (!comment) return res.status(404).json({ msg: "Comment not found" });

    // Check if the comment belongs to the answer
    if (!answer.comments.includes(comment._id)) {
      return res
        .status(400)
        .json({ msg: "Comment does not belong to this answer" });
    }

    // Remove the comment from the answer
    answer.comments = answer.comments.filter(
      (id) => id.toString() !== comment._id.toString()
    );
    await answer.save();

    // Remove the comment from the database
    await Comment.findByIdAndRemove(req.params.commentId);

    res.json({ msg: "Comment removed successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});
module.exports = router;
