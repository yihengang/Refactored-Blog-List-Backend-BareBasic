const blogsRouter = require("express").Router();
const blog = require("../models/blog");
const Blog = require("../models/blog");
const mongoose = require("mongoose");

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

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({});
  response.json(blogs);
});

blogsRouter.post("/", async (request, response) => {
  const blog = request.body;

  if (blog.title === undefined || blog.url === undefined) {
    response.status(400).json({ error: "title or url is missing" });
  } else {
    const newBlog = new Blog({
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: blog.likes || 0,
    });

    const savedBlog = await newBlog.save();
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
  };
  //////testing

  await Blog.findByIdAndUpdate(request.params.id, updatedBlog, { new: true });
  response.json(updatedBlog);
});

module.exports = blogsRouter;
