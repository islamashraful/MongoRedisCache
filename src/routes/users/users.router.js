const express = require("express");
const blogsRouter = require("../blogs/blogs.router");

const router = express.Router();

router.use("/:userId/blogs", blogsRouter);

module.exports = router;
