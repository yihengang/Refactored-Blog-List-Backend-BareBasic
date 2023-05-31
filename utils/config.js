require("dotenv").config();

const mongoUrl =
  process.env.NODE_ENV === "test"
    ? process.env.test_mongoUrl
    : process.env.mongoUrl;

const PORT = process.env.PORT;

module.exports = { mongoUrl, PORT };
