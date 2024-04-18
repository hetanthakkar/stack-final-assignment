// Import required modules and models
const express = require("express");
const router = express.Router();
const Comment = require("../models/comments");

// Upvote a comment
router.put("/comments/:id/upvote", async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ msg: "Comment not found" });

    const userId = req.user._id; // Assuming you have middleware to get the current user

    // Check if the user has already upvoted
    if (comment.upvotes.includes(userId)) {
      return res
        .status(400)
        .json({ msg: "You have already upvoted this comment" });
    }

    // Check if the user has downvoted and remove the downvote
    if (comment.downvotes.includes(userId)) {
      comment.downvotes = comment.downvotes.filter(
        (id) => id.toString() !== userId.toString()
      );
    }

    comment.upvotes.push(userId);
    await comment.save();

    res.json({ msg: "Comment upvoted successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// Downvote a comment
router.put("/comments/:id/downvote", async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ msg: "Comment not found" });

    const userId = req.user._id; // Assuming you have middleware to get the current user

    // Check if the user has already downvoted
    if (comment.downvotes.includes(userId)) {
      return res
        .status(400)
        .json({ msg: "You have already downvoted this comment" });
    }

    // Check if the user has upvoted and remove the upvote
    if (comment.upvotes.includes(userId)) {
      comment.upvotes = comment.upvotes.filter(
        (id) => id.toString() !== userId.toString()
      );
    }

    comment.downvotes.push(userId);
    await comment.save();

    res.json({ msg: "Comment downvoted successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});
