const supertest = require("supertest");
const app = require("../app.js");
const mongoose = require("mongoose");
const Blog = require("../models/blog");
const helper = require("./test_helper.js");

const api = supertest(app);

beforeEach(async () => {
  await Blog.deleteMany({});
  let newBlog = new Blog(helper.initialBlogs[0]);
  await newBlog.save();
  newBlog = new Blog(helper.initialBlogs[1]);
  await newBlog.save();
  newBlog = new Blog(helper.initialBlogs[2]);
  await newBlog.save();
});

test("get all notes in JSON format", async () => {
  //make a get request and expect
  response = await api
    .get("/api/blogs")
    .expect("Content-Type", /application\/json/);

  expect(response.body).toHaveLength(helper.initialBlogs.length);
});

test("has _id property", async () => {
  //make a get request and expect
  response = await api.get("/api/blogs");

  expect(response.body[0]).toBeDefined();
  expect(response.body[0].hasOwnProperty("id")).toBeTruthy();
  expect(response.body[0]).toHaveProperty("id");
  // expect(response.body[0].id).toBe("6460f9a8563fc07b6642f4f5");
  expect(response.body[0].id).toBeDefined();
});

test("posted blog exists in blog list", async () => {
  const newBlog = {
    title: "newBlog",
    author: "Random",
    url: "http://newBlog.random",
    likes: 5,
  };
  //make a get request and expect
  const response = await api
    .post("/api/blogs")
    .send(newBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/);
  console.log(response.body);

  const blogList = await api.get("/api/blogs");
  const titlesOnly = blogList.body.map((b) => b.title);
  console.log(blogList.body);
  expect(blogList.body.length).toEqual(helper.initialBlogs.length + 1);
  expect(titlesOnly).toContain("newBlog");
});

test("posted blog without likes property defaults to value 0", async () => {
  const newBlog = {
    title: "newBlog",
    author: "Random",
    url: "http://newBlog.random",
  };
  //make a get request and expect
  const response = await api
    .post("/api/blogs")
    .send(newBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/);
  console.log(response.body);

  const blogList = await api.get("/api/blogs");
  const titlesOnly = blogList.body.map((b) => b.title);
  console.log(blogList.body);
  expect(blogList.body.length).toEqual(helper.initialBlogs.length + 1);
  expect(blogList.body[3].likes).toEqual(0);
  expect(titlesOnly).toContain("newBlog");
});

test("400 Bad Request response if title property is missing", async () => {
  const newBlog = {
    author: "Random",
    url: "http://newBlog.random",
    likes: 10,
  };

  await api.post("/api/blogs").send(newBlog).expect(400);
});

test("400 Bad Request response if url property is missing", async () => {
  const newBlog = {
    title: "newBlog",
    author: "Random",
    likes: 10,
  };

  await api.post("/api/blogs").send(newBlog).expect(400);
});

test("Deleted blog should no longer exist", async () => {
  //drag out the id to be deleted
  const startingBlogs = await api.get("/api/blogs");
  const blogsId = startingBlogs.body[0].id;

  //delete the thing
  await api.delete(`/api/blogs/${blogsId}`).expect(204);
  //get and see if the length decreases and see if blog still exists
  const response = await api.get("/api/blogs");
  expect(response.body.length).toEqual(helper.initialBlogs.length - 1);

  const remainingTitles = response.body.map((r) => r.title);
  console.log(remainingTitles);
  expect(remainingTitles).not.toContain("React patterns");
});

test("Updated blog", async () => {
  //drag out the id to be updated
  const startingBlogs = await api.get("/api/blogs");
  const blogsId = startingBlogs.body[0].id;

  const updatedBlog = {
    title: "updatedBlog",
    author: "updated",
    url: "www.updatedBlog.com",
    likes: 10,
  };

  //update the thing
  await api.put(`/api/blogs/${blogsId}`).send(updatedBlog);
  //get and see if the length remains and see if the blog now contains the updated thing
  const response = await api.get("/api/blogs");
  console.log(response.body);
  expect(response.body.length).toEqual(helper.initialBlogs.length);

  const newTitles = response.body.map((r) => r.title);
  console.log(newTitles);
  expect(newTitles).toContain("updatedBlog");
});

afterAll(async () => {
  await mongoose.connection.close();
});
