const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const loginRouter = require("express").Router();
const User = require("../models/user");

loginRouter.post("/", async (request, response) => {
  //first destructure the username and password from request body
  const { username, password } = request.body;

  //take the username and see if a corresponding user exists in the database
  const user = await User.findOne({ username });

  const passwordCorrect =
    user === null ? false : await bcrypt.compare(password, user.passwordHash);

  //if user exists and passwordCorrect doesn't exist, return appropriate response
  //if they do, create token

  if (!(username && passwordCorrect)) {
    response.status(401).json({ error: "Invalid username or password" });
  }

  const userForToken = { username: user.username, id: user._id };

  const token = jwt.sign(userForToken, process.env.SECRET, {
    expiresIn: 60 * 60,
  });

  response
    .status(200)
    .send({ token, username: user.username, name: user.name });
});

module.exports = loginRouter;
