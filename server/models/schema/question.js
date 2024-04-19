const mongoose = require("mongoose");

var Schema = mongoose.Schema;
module.exports = mongoose.Schema(
  {
    title: { type: String, required: true },
    text: { type: String, required: true },
    asked_by: { type: String, required: true },
    ask_date_time: { type: Date, required: true },
    views: [{ type: Schema.Types.ObjectId, ref: "User" }],
    answers: [{ type: Schema.Types.ObjectId, ref: "Answer" }],
    tags: [{ type: Schema.Types.ObjectId, ref: "Tag", required: true }],
    upvotes: [{ type: Schema.Types.ObjectId, ref: "User" }],
    downvotes: [{ type: Schema.Types.ObjectId, ref: "User" }],
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
  },
  { collection: "Question" }
);
