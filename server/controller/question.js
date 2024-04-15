const express = require("express");
const Question = require("../models/questions");

const { addTag, getQuestionsByOrder, filterQuestionsBySearch } = require('../utils/question');

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
        res.status(500).json({ msg: 'Internal server error' });
    }
};

const getQuestionById = async (req, res) => {
    try {
        const questionId = req.params.id;
        let question = await Question.findOneAndUpdate({_id: questionId}, { $inc: {views: 1}}, {new: true});
        question = await question.populate('answers');
        res.status(200)
        res.json( question );
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Internal server error' });
    }
};


const addQuestion = async (req, res) => {
    let tags = await Promise.all(req.body.tags.map(async (tag) => {
        return await addTag(tag);
    }))
    let question = await Question.create({
        title: req.body.title,
        text: req.body.text,
        asked_by: req.body.asked_by,
        ask_date_time: req.body.ask_date_time,
        tags: tags
    });
    res.json(question);
};


router.get('/getQuestion', (req, res) => {
    getQuestionsByFilter(req, res).then((data) => {
        return data;
    });
});

router.get('/getQuestionById/:id', (req,res) => getQuestionById(req,res).then((data) => {
    return data;
}));

router.post('/addQuestion', (req, res) => addQuestion(req, res).then((data) => {
    return data;
}));

module.exports = router;
