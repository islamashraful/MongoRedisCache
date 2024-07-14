const blogs = require("./blogs.mongo");
const { clearCache } = require("../services/cache");

async function getAllBlogs() {
  return blogs.find();
}

async function getAllBlogsByUser(userId) {
  return await blogs
    .find({
      user: userId,
    })
    .cache({ key: userId });
}

async function addNewBlog(blog) {
  const newBlog = new blogs(blog);
  await newBlog.save();

  clearCache(blog.user);
}

module.exports = {
  getAllBlogs,
  getAllBlogsByUser,
  addNewBlog,
};
