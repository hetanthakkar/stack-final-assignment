import express from "express";
import cors from "cors";
import morgan from "morgan";
import connect from './database/connection.js'
import router from './router/route.js'

const app = express();

app.use(express.json()); // This line was incorrect, should be express.json() instead of express()
app.use(cors());
app.use(morgan("tiny"));
app.disable("x-powered-by");

const port = 8080;

/**
 * HTTP request
 */
app.get("/", (req, res) => {
  res.status(201).json("Get Request for Home Page");
});


app.use('/api', router)
/**
 * Starting of our server only after successful connection
 */

connect()
  .then(() => {
    try {
      app.listen(port, () => {
        console.log(`Server Connected to http://localhost:${port}`);
      });
    } catch (error) {
      console.log("Database is not connected successfully...");
    }
  })
  .catch((error) => {
    console.log("Invalid Database Connection...");
  });
