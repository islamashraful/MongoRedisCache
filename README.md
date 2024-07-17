# MongoRedisCache

This project includes a Node.js application with MongoDB and Redis services. Redis is used as a caching layer on top of Mongo.

The `cache.js` module modified the default behaviour of the Mongoose exec function to hook into any queries throughout the application and run caching logic in a centralized place.

## 🕸️ Snippets

<details>
<summary><code>src/services/cache.js</code></summary>

```js
const redis = require("redis");
const mongoose = require("mongoose");

const exec = mongoose.Query.prototype.exec;

let redisClient;

async function getRedisClient() {
  if (redisClient) return;

  return redis
    .createClient({
      url: "redis://redis:6379",
    })
    .on("error", (err) => console.log("Redis Client Error", err))
    .connect();
}

mongoose.Query.prototype.cache = function (options = {}) {
  this.useCache = true;
  this.hashKey = JSON.stringify(options.key || "default");

  return this;
};

mongoose.Query.prototype.exec = async function () {
  if (!this.useCache) {
    return exec.apply(this, arguments);
  }

  if (!redisClient) {
    redisClient = await getRedisClient();
  }

  const redisKey = JSON.stringify({
    ...this.getQuery(),
    ...{ collection: this.mongooseCollection.name },
  });

  const cachedValue = await redisClient.hGet(this.hashKey, redisKey);
  if (cachedValue) {
    console.log("serving from cache");
    const doc = JSON.parse(cachedValue);

    return Array.isArray
      ? doc.map((item) => new this.model(item))
      : new this.model(doc);
  }

  const result = await exec.apply(this, arguments);
  console.log("serving from DB");
  redisClient.hSet(this.hashKey, redisKey, JSON.stringify(result));
  return result;
};

module.exports = {
  async clearCache(hashKey) {
    if (!redisClient) {
      redisClient = await getRedisClient();
    }

    redisClient.del(JSON.stringify(hashKey));
  },
};
```

</details>
<details>
<summary><code>src/models/blogs.model.js</code></summary>

```js
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
```

</details>

## Services

### Node.js Application

The Node.js application runs using Node.js version 18.

### MongoDB

MongoDB instance running the xenial version.

### Redis

Redis server using the redis-stack-server image.

## Up and Running

```sh
npm i
docker-compose up
```

## Sample Requests

```bash
# Getting the blogs for user: 6693cc6d7a9129a0bdaf2ffb

# First time it serves from db,
# then it will be cached in redis,
# until a new blog created for this user
curl http://localhost:3000/users/6693cc6d7a9129a0bdaf2ffb/blogs

# Create new blog for user: 6693cc6d7a9129a0bdaf2ffb
curl -X POST \
  http://localhost:3000/users/6693cc6d7a9129a0bdaf2ffb/blogs \
  -H 'Content-Type: application/json' \
  -d '{
    "title": "Checking Cache",
    "content": "Checking cache invalidation"
  }'

# Get all blogs (doesn't use any cache)
curl http://localhost:3000/blogs

```

## Useful Commands(Redis)

```sh
# Connect to the Redis server
docker exec -it my-redis-container redis-cli

# Return all keys in the current database
keys *

# Returns all field names in the hash stored at key
hkeys <key-with-quotes>

# Get the value of field
hget <key-with-quotes> <field>

# Create a hash with multiple fields
hset myhash field1 "value1" field2 "value2" field3 "value3"

# Check if a field exists (returns 1 if exists, 0 otherwise)
hexists myhash field

# Get all fields and values in the hash
hgetall myhash
```
