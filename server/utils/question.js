const Tag = require("../models/tags");
const Question = require("../models/questions");
// const Answer = require("../models/answers");

const addTag = async (tname) => {
    let isPresent = await Tag.findOne({ name: tname });
    if (isPresent) {
        return isPresent._id;
    } else {
        let tag = Tag({ name: tname });
        const saveTag = await tag.save();
        return saveTag._id;
    }
};
const getMaxAnsDate = (question) => {
    if (!question || !question.answers || question.answers.length === 0) {
        return 0;
    }
    const answerDates = question.answers.map((answer) => {
        //   const answer = this.answers.find((ans) => ans.aid === aid);
        //   return answer ? answer.ansDate : 0;
        return answer.ans_date_time;
    });
    return Math.max(...answerDates);
};
const getQuestionsByOrder = async (order) => {
    // complete the function
    let qlist = await Question.find().populate('tags').populate('answers');
    if (order === "newest") {
        qlist.sort((a, b) => b.ask_date_time - a.ask_date_time);
    } else if (order === "unanswered") {
        qlist = qlist.filter((question) => question.answers.length === 0);
        qlist.sort((a, b) => b.ask_date_time - a.ask_date_time);
    } else if (order === "active") {
        qlist.sort((a, b) => b.ask_date_time - a.ask_date_time);
        qlist.sort((a, b) => {
            return getMaxAnsDate(b) - getMaxAnsDate(a);
        })
    }
    return qlist;
}

const filterQuestionsBySearch = (qlist, search) => {
    // complete the function return [];
    let qlist2 = [...qlist];
    // console.log("inside filter");
    if (search.length > 0) {
        search = search.trim().toLowerCase();
        const searchTags = search.match(/\[([^\]]+)\]/g);
        const nonTags = search.replace(/\[([^\]]+)\]/g, '').trim().split(/\s+/);
        let mergedList = [];
        if (searchTags) {
            const tagNames = searchTags.map((tag) => tag.replace(/\[|\]/g, '').toLowerCase());
            qlist = qlist.filter(question =>
                question.tags.some(tag => tagNames.includes(tag.name)));
            mergedList = [...qlist];
        }
        if (nonTags && nonTags[0] !== '') {
            // console.log("here1")
            nonTags.forEach((t) => { 
                qlist2 = qlist2.filter((question) => { 
                    // console.log("question", question.text);
                    return question.title.toLowerCase().includes(t) || question.text.toLowerCase().includes(t)});
            })
            // console.log("after filter", qlist2);
            qlist2.forEach((q) => {
                if (!mergedList.includes(q)) {
                    mergedList.push(q);
                }
            })
            // console.log("list 2", qlist2);
        }
        mergedList.sort((a, b) => b.askDate - a.askDate);
        return mergedList;
    }
    return qlist;
}


module.exports = { addTag, getQuestionsByOrder, filterQuestionsBySearch };