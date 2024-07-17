const express = require("express");
const blogsRouter = require("./routes/blogs/blogs.router");
const usersRouter = require("./routes/users/users.router");

const app = express();

app.use(express.json());

app.use("/blogs", blogsRouter);
app.use("/users", usersRouter);

module.exports = app;
