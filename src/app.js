const express = require("express");
const blogsRouter = require("./routes/blogs/blogs.router");

const app = express();

app.use(express.json());

app.use("/blogs", blogsRouter);

module.exports = app;
