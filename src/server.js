const http = require("http");

const app = require("./app");
const { loadSampleBlogs } = require("./seed");
const { connectMongo } = require("./services/mongo");

const server = http.createServer(app);

const PORT = 3000;
(async function () {
  await connectMongo();

  await loadSampleBlogs();

  server.listen(PORT, () => {
    console.log(`App listening at http://localhost:${PORT}`);
  });
})();
