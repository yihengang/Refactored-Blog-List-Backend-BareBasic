require("dotenv").config();

const mongoUrl = process.env.mongoUrl;

const PORT = process.env.PORT;

module.exports = { mongoUrl, PORT };
