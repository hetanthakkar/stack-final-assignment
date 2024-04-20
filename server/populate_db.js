let userArgs = process.argv.slice(2);

if (!userArgs[0].startsWith("mongodb")) {
  console.log(
    "ERROR: You need to specify a valid mongodb URL as the first argument"
  );
  return;
}

let Tag = require("./models/tags");
let Answer = require("./models/answers");
let Question = require("./models/questions");

let mongoose = require("mongoose");
const User = require("./models/schema/User");
const { createMockUser } = require("./utils/question");
const comments = require("./models/comments");
let mongoDB = userArgs[0];
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
let db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

db.once("open", async function () {
  try {
    await populate();
    // if (db) db.close();
    console.log("done");
  } catch (err) {
    console.log("ERROR: " + err);
    if (db) db.close();
  }
});

function tagCreate(name) {
  let tag = new Tag({ name: name });
  return tag.save();
}

function answerCreate(text, ans_by, ans_date_time) {
  let answerdetail = { text: text };
  if (ans_by != false) answerdetail.ans_by = ans_by;
  if (ans_date_time != false) answerdetail.ans_date_time = ans_date_time;

  let answer = new Answer(answerdetail);
  return answer.save();
}

function questionCreate(
  title,
  text,
  tags,
  answers,
  asked_by,
  ask_date_time,
  views,
  upvotes,
  downvotes,
  comments
) {
  qstndetail = {
    title: title,
    text: text,
    tags: tags,
    asked_by: asked_by,
    upvotes: upvotes,
    downvotes: downvotes,
    comments: comments,
  };
  if (answers != false) qstndetail.answers = answers;
  if (ask_date_time != false) qstndetail.ask_date_time = ask_date_time;
  if (views != false) qstndetail.views = views;

  let qstn = new Question(qstndetail);
  return qstn.save();
}

function commentCreate(text, posted_by, posted_date_time, upvotes, downvotes) {
  qstndetail = {
    text,
    posted_by,
    posted_date_time,
    upvotes,
    downvotes,
  };

  let comment = new comments(qstndetail);
  return comment.save();
}

// const mongoose = require("mongoose");

// module.exports = mongoose.Schema(
//   {
//     text: { type: String, required: true },
//     posted_by: { type: String, required: true },
//     posted_date_time: { type: Date, required: true },
//     upvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
//     downvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
//   },
//   { collection: "Comments" }
// );

async function createUser(username, password, email, isModerator) {
  let userDetail = {
    username: username,
    password: password,
    email: email,
  };
  return await createMockUser(userDetail);
}

const populate = async () => {
  let t1 = await tagCreate("react");
  let t2 = await tagCreate("javascript");
  let t3 = await tagCreate("android-studio");
  let t4 = await tagCreate("shared-preferences");
  let t5 = await tagCreate("storage");
  let t6 = await tagCreate("website");
  let t7 = await tagCreate("Flutter");
  let u1 = await createUser(
    "Hetan NA Thakkar",
    "password123",
    "hetaan.doe@example.com"
  );
  let u2 = await createUser("Devam JAA", "password123", "devs.doe@example.com");
  let u3 = await createUser("hetan", "hetan", "mta.doe@example.com");
  console.log(u1, "user1");
  let c1 = await commentCreate("Comment1", u1, new Date(), [u1, u3]);
  let c2 = await commentCreate("Comment2", u3, new Date(), [u1, u2]);
  let c3 = await commentCreate("Comment3", u2, new Date(), [u1, u2, u3]);
  let a1 = await answerCreate(
    "React Router is mostly a wrapper around the history library. history handles interaction with the browser's window.history for you with its browser and hash histories. It also provides a memory history which is useful for environments that don't have a global history. This is particularly useful in mobile app development (react-native) and unit testing with Node.",
    "hamkalo",
    new Date("2023-11-20T03:24:42")
  );
  let a2 = await answerCreate(
    "On my end, I like to have a single history object that I can carry even outside components. I like to have a single history.js file that I import on demand, and just manipulate it. You just have to change BrowserRouter to Router, and specify the history prop. This doesn't change anything for you, except that you have your own history object that you can manipulate as you want. You need to install history, the library used by react-router.",
    "azad",
    new Date("2023-11-23T08:24:00")
  );
  let a3 = await answerCreate(
    "Consider using apply() instead; commit writes its data to persistent storage immediately, whereas apply will handle it in the background.",
    "abaya",
    new Date("2023-11-18T09:24:00")
  );
  let a4 = await answerCreate(
    "YourPreference yourPrefrence = YourPreference.getInstance(context); yourPreference.saveData(YOUR_KEY,YOUR_VALUE);",
    "alia",
    new Date("2023-11-12T03:30:00")
  );
  let a5 = await answerCreate(
    "I just found all the above examples just too confusing, so I wrote my own. ",
    "sana",
    new Date("2023-11-01T15:24:19")
  );
  let a6 = await answerCreate(
    "Storing content as BLOBs in databases.",
    "abhi3241",
    new Date("2023-02-19T18:20:59")
  );
  let a7 = await answerCreate(
    "Using GridFS to chunk and store content.",
    "mackson3332",
    new Date("2023-02-22T17:19:00")
  );
  let a8 = await answerCreate(
    "Store data in a SQLLite database.",
    "ihba001",
    new Date("2023-03-22T21:17:53")
  );
  await questionCreate(
    "Programmatically navigate using React router",
    "the alert shows the proper index for the li clicked, and when I alert the variable within the last function Im calling, moveToNextImage(stepClicked), the same value shows but the animation isnt happening. This works many other ways, but Im trying to pass the index value of the list item clicked to use for the math to calculate.",
    [t1, t2],
    [a1, a2],
    "Joji John",
    new Date("2022-01-20T03:00:00"),
    [a1, a2],
    [a1, a2, a3],
    [],
    [c2]
  );
  await questionCreate(
    "android studio save string shared preference, start activity and load the saved string",
    "I am using bottom navigation view but am using custom navigation, so my fragments are not recreated every time i switch to a different view. I just hide/show my fragments depending on the icon selected. The problem i am facing is that whenever a config change happens (dark/light theme), my app crashes. I have 2 fragments in this activity and the below code is what i am using to refrain them from being recreated.",
    [t3, t4, t2],
    [a3, a4, a5],
    "saltyPeter",
    new Date("2023-01-10T11:24:30"),
    [a3, a2],
    [a1, a2],
    [],
    [c3, c2]
  );
  await questionCreate(
    "Object storage for a web application",
    "I am currently working on a website where, roughly 40 million documents and images should be served to its users. I need suggestions on which method is the most suitable for storing content with subject to these requirements.",
    [t5, t6],
    [a6, a7],
    "monkeyABC",
    new Date("2023-02-18T01:02:15"),
    [a1, a3],
    [a1, a2],
    [],
    [c1, c3]
  );
  await questionCreate(
    "Quick question about storage on android",
    "I would like to know the best way to go about storing an array on an android phone so that even when the app/activity ended the data remains",
    [t3, t4, t5],
    [a8],
    "elephantCDE",
    new Date("2023-03-10T14:28:01"),
    [a1, a2],
    [a1, a2, a3],
    [],
    [c1, c2]
  );
  db.close();
};

console.log("processing ...");
