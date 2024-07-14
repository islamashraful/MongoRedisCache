const express = require("express");

const {
  httpGetAllBlogs,
  httpGetAllBlogsByUser,
  httpAddNewBlog,
} = require("./blogs.controller");

const blogsRouter = express.Router();

blogsRouter.get("/", httpGetAllBlogs);
blogsRouter.get("/:userId", httpGetAllBlogsByUser);
blogsRouter.post("/", httpAddNewBlog);

module.exports = blogsRouter;
