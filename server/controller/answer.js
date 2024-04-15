const express = require("express");
const Answer = require("../models/answers");
const Question = require("../models/questions");

const router = express.Router();

router.post('/addAnswer', async (req, res) => {
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

module.exports = router;
