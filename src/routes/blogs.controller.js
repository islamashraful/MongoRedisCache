const {
  getAllBlogs,
  getAllBlogsByUser,
  addNewBlog,
} = require("../models/blogs.model");
const { existsUserWithId } = require("../models/users.model");

async function httpGetAllBlogs(req, res) {
  res.status(200).send(await getAllBlogs());
}

async function httpGetAllBlogsByUser(req, res) {
  res.status(200).send(await getAllBlogsByUser(req.params.userId));
}

async function httpAddNewBlog(req, res) {
  const { title, content, user } = req.body;
  if (!title || !content || !user) {
    return res.status(400).json({
      error: "Missing required blog property",
    });
  }

  if (!(await existsUserWithId(user))) {
    return res.status(404).json({
      error: "User not found",
    });
  }

  await addNewBlog({ title, content, user });

  res.status(200).json({
    ok: true,
  });
}

module.exports = {
  httpGetAllBlogs,
  httpGetAllBlogsByUser,
  httpAddNewBlog,
};
