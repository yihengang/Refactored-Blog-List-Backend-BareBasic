const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

// const blog = new Blog({
//   title: "dfgdfg",
//   author: "dfgdfgdfg",
//   url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
//   likes: 10,
// });

// blog.save().then((result) => {
//   console.log("note saved!");
//   console.log(result);
//   // if connection not closed, program will never finish its execution
//   mongoose.connection.close();
// });

const getTokenFrom = (request) => {
  const authorization = request.get("authorization");
  if (authorization && authorization.startsWith("Bearer ")) {
    return authorization.replace("Bearer ", "");
  }
  return null;
};

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", {
    username: 1,
    name: 1,
    id: 1,
  });
  response.json(blogs);
});

blogsRouter.post("/", async (request, response, next) => {
  const blogFromBody = request.body;
  //if there is a problem with following line, if token is missing or invalid, error will be JsonWebTokenError, and middleware called
  const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET);
  console.log("token:" + decodedToken);
  if (!decodedToken.id) {
    return response.status(401).json({ error: "token invalid" });
  }

  //receive notes which will stipulate user's id and dig into user database to extract this user's object blog on post body will have property 'userId'
  const user = await User.findById(decodedToken.id);

  if (blogFromBody.title === undefined || blogFromBody.url === undefined) {
    return response.status(400).json({ error: "title or url is missing" });
  } else {
    const newBlog = new Blog({
      title: blogFromBody.title,
      author: blogFromBody.author,
      url: blogFromBody.url,
      likes: blogFromBody.likes || 0,
      user: user._id,
    });

    newBlog.populate("user", {
      username: 1,
      name: 1,
      id: 1,
    });

    const savedBlog = await newBlog.save();
    user.blogs = user.blogs.concat(savedBlog._id);
    await user.save();
    console.log(savedBlog);
    response.status(201).json(savedBlog);
  }
});

blogsRouter.delete("/:id", async (request, response) => {
  //get all the blogs, loop through and delete the one with matching id
  await Blog.findByIdAndRemove(request.params.id);
  response.status(204).end();
});

blogsRouter.put("/:id", async (request, response) => {
  const blog = request.body;

  const updatedBlog = {
    title: blog.title,
    author: blog.author,
    url: blog.url,
    likes: blog.likes || 0,
    user: blog.user,
  };
  //////testing

  const prepopulatedModblog = await Blog.findByIdAndUpdate(
    request.params.id,
    updatedBlog,
    {
      new: true,
      runValidators: true,
      context: "query",
    }
  ).populate("user", {
    username: 1,
    name: 1,
    id: 1,
  });
  response.json(prepopulatedModblog);
});

module.exports = blogsRouter;
