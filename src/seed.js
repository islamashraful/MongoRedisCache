const User = require("./models/users.mongo");
const Blog = require("./models/blogs.mongo");

// Function to upsert sample users and their corresponding blog posts
async function loadSampleBlogs() {
  try {
    const userData = [
      {
        _id: "6693cc6d7a9129a0bdaf2ffb",
        username: "johndoe",
        email: "johndoe@example.com",
      },
      {
        _id: "6693cc6d7a9129a0bdaf2ff6",
        username: "janedoe",
        email: "janedoe@example.com",
      },
    ];

    const userPromises = userData.map((user) =>
      User.updateOne(
        { _id: user._id },
        { $set: user },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      )
    );

    const userResults = await Promise.all(userPromises);

    const users = await User.find({
      email: { $in: userData.map((u) => u.email) },
    });

    const blogPromises = [];

    users.forEach((user) => {
      for (let i = 1; i <= 3; i++) {
        const blog = {
          title: `Blog Post ${i} by ${user.username}`,
          content: `This is the content of blog post ${i} by ${user.username}.`,
          user: user._id,
        };

        blogPromises.push(
          Blog.updateOne(
            { title: blog.title },
            { $set: blog },
            { upsert: true, new: true, setDefaultsOnInsert: true }
          )
        );
      }
    });

    await Promise.all(blogPromises);
    console.log("Users and blog posts upserted successfully");
  } catch (error) {
    console.error("Error creating sample data:", error);
  }
}

module.exports = {
  loadSampleBlogs,
};
