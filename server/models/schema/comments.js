const mongoose = require("mongoose");


module.exports = mongoose.Schema(
    {
        text: {type: String, required: true},
        posted_by: {type: String, required: true},
        posted_date_time: {type: Date, required: true},
    },
    { collection: "Comments" }
);
