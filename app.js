require("express-async-errors");
require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const morgan = require("morgan");
const app = express();

const port = process.env.PORT || 5000;
const db = process.env.DB_URI;

const customErrorMiddleware = require("./middleware/error-handler");
const notFoundMiddleware = require("./middleware/not-found");
const authMiddleware = require("./middleware/auth");

const postRouter = require("./routes/postRoute");
const authRoute = require("./routes/authRoute");
const accountRoute = require("./routes/accountRoute");

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(morgan("combined"));

app.use(cookieParser());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("<h1>TEST</h1>");
});

app.use("/api/post", postRouter);
app.use("/api/auth", authRoute);
app.use("/api/account", authMiddleware, accountRoute);

app.use(customErrorMiddleware);
app.use(notFoundMiddleware);

app.listen(port, async () => {
  await mongoose.connect(db);
  console.log(`Listening on http://localhost:${port}/`);
});
