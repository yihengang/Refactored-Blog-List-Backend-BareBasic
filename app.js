const express = require("express");
const app = express();
require("express-async-errors");
const blogsRouter = require("./controllers/blogs");
const usersRouter = require("./controllers/users");
const loginRouter = require("./controllers/login");
const mongoose = require("mongoose");
const config = require("./utils/config");
const cors = require("cors");
const middleware = require("./utils/middleware");

mongoose.connect(config.mongoUrl);

// app.use(cors());
app.use(express.json());
app.use(express.static("build"));

app.use("/api/blogs", blogsRouter);
app.use("/api/users", usersRouter);
app.use("/api/login", loginRouter);

app.use(middleware.errorHandler);

module.exports = app;
