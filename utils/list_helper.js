const totalLikes = (blogs) => {
  const reducer = (sum, blog) => {
    return sum + blog.likes;
  };
  return blogs.reduce(reducer, 0);
};

const favouriteBlog = (blogs) => {
  const selectedProperties = (obj) => {
    const { title, author, likes } = obj;
    return { title, author, likes };
  };

  const numLikes = blogs.map((blog) => blog.likes);
  const maxLikes = Math.max(...numLikes);

  const favBlog = blogs.find((blog) => blog.likes === maxLikes);
  return selectedProperties(favBlog);
};

const mostBlogs = (blogs) => {
  const authorNames = blogs.map((blog) => blog.author);

  const frequencyCount = authorNames.reduce((obj, str) => {
    obj[str] = (obj[str] || 0) + 1;
    return obj;
  }, {});

  const mostRepeatedAuthorName = Object.keys(frequencyCount).reduce((a, b) =>
    frequencyCount[a] > frequencyCount[b] ? a : b
  );

  const count = authorNames.filter(
    (str) => str === mostRepeatedAuthorName
  ).length;

  const mostRepeatedAuthor = {
    author: mostRepeatedAuthorName,
    blogs: count,
  };

  return mostRepeatedAuthor;
};

const mostLikes = (blogs) => {
  const likeVol = blogs.map((blog) => blog.likes);

  const maxLikes = Math.max(...likeVol);

  const authorWithMostLikedBlog = blogs.filter(
    (blog) => blog.likes === maxLikes
  )[0].author;

  const deetsMostlikeBlog = {
    author: authorWithMostLikedBlog,
    blogs: maxLikes,
  };

  console.log(deetsMostlikeBlog);

  return deetsMostlikeBlog;
};

module.exports = { totalLikes, favouriteBlog, mostBlogs, mostLikes };
