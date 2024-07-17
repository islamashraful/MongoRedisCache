const express = require("express");

const { httpGetBlogs, httpAddNewBlog } = require("./blogs.controller");

const blogsRouter = express.Router({ mergeParams: true });

blogsRouter.get("/", httpGetBlogs);
blogsRouter.post("/", httpAddNewBlog);

module.exports = blogsRouter;
