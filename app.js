require("express-async-errors");
require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const app = express();

const port = process.env.PORT || 5000;
const db = process.env.DB_URI;

const customErrorMiddleware = require("./middleware/error-handler");
const notFoundMiddleware = require("./middleware/not-found");

const postRouter = require("./routes/postRoute");

app.use(express.json());

app.get("/", (req, res) => {
  res.send("<h1>TEST</h1>");
});

app.use("/api/post", postRouter);

app.use(customErrorMiddleware);
app.use(notFoundMiddleware);

app.listen(port, async () => {
  await mongoose.connect(db);
  console.log(`Listening on http://localhost:${port}/`);
});
