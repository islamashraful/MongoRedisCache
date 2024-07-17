const {
  getAllBlogs,
  getAllBlogsByUser,
  addNewBlog,
} = require("../../models/blogs.model");
const { existsUserWithId } = require("../../models/users.model");

// @desc    Get blogs
// @route   GET /blogs
// @route   GET /blogs/:userId
async function httpGetBlogs(req, res) {
  if (req.params.userId) {
    res.status(200).send(await getAllBlogsByUser(req.params.userId));
  } else {
    res.status(200).json(await getAllBlogs());
  }
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
  httpGetBlogs,
  httpAddNewBlog,
};
