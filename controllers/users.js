const usersRouter = require("express").Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");

usersRouter.get("/", async (request, response) => {
  const users = await User.find({}).populate("blogs", {
    url: 1,
    title: 1,
    author: 1,
    id: 1,
  });
  response.json(users);
});

//create post so that when post, will get saved
usersRouter.post("/", async (request, response) => {
  const { username, name, password } = request.body;

  const saltRounds = 10;

  if (!password) {
    response.status(400).json({ error: "No password entered!" });
  } else if (password.length < 3) {
    response.status(400).json({
      error: "Password must have a length of more than two characters",
    });
  } else {
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const user = new User({
      username: username,
      name: name,
      passwordHash: passwordHash,
    });

    user.populate("blogs", { title: 1, author: 1, url: 1 });

    const savedUser = await user.save();
    response.status(201).json(savedUser);
  }
});

module.exports = usersRouter;
