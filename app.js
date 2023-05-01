const express = require("express");
const app = express();
const blogsRouter = require("./controllers/blogs");
const mongoose = require("mongoose");
const config = require("./utils/config");
const cors = require("cors");

mongoose.connect(config.mongoUrl);

// app.use(cors());
app.use(express.json());
app.use(express.static("build"));

app.use("/api/blogs", blogsRouter);

module.exports = app;
