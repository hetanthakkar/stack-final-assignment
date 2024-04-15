const mongoose = require("mongoose");

const Comments = require("./schema/comments.js");

module.exports = mongoose.model("Comments", Comments);
