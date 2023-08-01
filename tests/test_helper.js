const initialBlogs = [
  {
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
  },
  {
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
  },
  {
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
  },
];

const initialUsers = [
  {
    username: "Username 1",
    name: "Name 1",
  },
  {
    username: "Username 2",
    name: "Name 2",
  },
  {
    username: "Username 3",
    name: "Name 3",
  },
];

const nonExistingId = async () => {
  const blog = new Blog({
    title: "To be deleted",
    author: "To be deleted",
    url: "http://tobedeleted.com",
    likes: 12,
  });

  await blog.save();
  await blog.deleteOne();

  return blog._id.toString();
};

const blogsInDb = async () => {
  const blogs = await Blog.find({});
  return blogs.map((blog) => blog.toJson());
};

module.exports = { initialBlogs, initialUsers, nonExistingId, blogsInDb };
